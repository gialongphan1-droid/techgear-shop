import { useMemo } from "react";
import { GodLights } from "godlights";

const animParams = {
  speed: 1.2,
  angleAmp: 35,
  lengthAmp: 25,
  widthAmp: 10,
  haloAmp: 40,
};

export function GodLightsHero({ animated = true, style }) {
  const scene = useMemo(
    () => ({
      width: 1920,
      height: 1080,
      noise: 8,
      grainSize: 1,
      layers: [
        {
          id: "background",
          type: "background",
          bgType: "transparent",
          bgColor: "#000000",
          bgColor2: "#000000",
          bgGradientAngle: 180,
        },
        {
          id: "rays",
          type: "rays",
          direction: 160,
          spread: 60,
          originX: 14,
          originY: -18,
          rayCount: 24,
          rayWidth: 72,
          divergence: 1.8,
          rayLength: 0.8,
          colorStart: "#ffffff",
          colorEnd: "#f88b5a",
          opacity: 0.22,
          blendMode: "screen",
          fadeToTransparent: true,
          blur: 16,
          randomnessWidth: 70,
          randomnessLength: 30,
          randomnessAngle: 10,
          seed: 42,
        },
        {
          id: "halo",
          type: "halo",
          originX: 20,
          originY: 4,
          color: "#ffffff",
          intensity: 0.2,
          size: 0.42,
          blendMode: "lighter",
        },
      ],
    }),
    [],
  );

  return (
    <GodLights
      scene={scene}
      animParams={animated ? animParams : undefined}
      style={style}
    />
  );
}
