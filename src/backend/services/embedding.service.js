import { pipeline } from "@huggingface/transformers";

const DEFAULT_MODEL = "onnx-community/granite-embedding-311m-multilingual-r2-ONNX";
const DEFAULT_DIMENSION = 768;

let extractorPromise;

function getEmbeddingConfig() {
  const model = process.env.EMBEDDING_MODEL?.trim() || DEFAULT_MODEL;
  const dimension = Number(process.env.EMBEDDING_DIMENSION || DEFAULT_DIMENSION);
  if (!Number.isSafeInteger(dimension) || dimension <= 0) {
    throw new Error("EMBEDDING_DIMENSION phải là số nguyên dương");
  }
  return { model, dimension };
}

async function getExtractor(model) {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", model, { dtype: "q8" }).catch((error) => {
      extractorPromise = undefined;
      throw error;
    });
  }
  return extractorPromise;
}

export async function embedText(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new TypeError("Văn bản cần tạo embedding phải là chuỗi không rỗng");
  }

  const { model, dimension } = getEmbeddingConfig();
  const extractor = await getExtractor(model);
  const output = await extractor(text.trim(), {
    pooling: "cls",
    normalize: false,
  });
  const values = output.tolist();
  const vector = Array.isArray(values[0]) ? values[0] : values;

  if (vector.length !== dimension) {
    throw new Error(`Model ${model} trả về ${vector.length} chiều, yêu cầu ${dimension}`);
  }
  if (!vector.every((value) => Number.isFinite(value))) {
    throw new Error(`Model ${model} trả về embedding chứa giá trị không hữu hạn`);
  }

  return vector;
}
