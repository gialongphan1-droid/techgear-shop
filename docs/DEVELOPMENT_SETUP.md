# Development Setup: AI Skills

Tài liệu này hướng dẫn cài và nhận diện các skill hỗ trợ phát triển TechGear Shop với GitHub Copilot.

## Cài skill cho GitHub Copilot

Cần cài Node.js/npm để dùng `npx`. Chạy lệnh sau trong terminal:

```bash
npx skills add rightcodehere/skills --skill rc-codeprobe-security -a github-copilot
```

Lệnh trên cài `rc-codeprobe-security` cho GitHub Copilot. Để cài một skill khác từ cùng repository, thay `rc-codeprobe-security` bằng tên skill tương ứng.

## Danh sách skill đã cài

Theo kiểm tra `~/.agents/skills/`, hiện có 13 skill:

- **BE core:** `rc-api-forge`, `rc-auth-architect`, `rc-code-review`, `rc-tdd`.
- **Audit:** `rc-codeprobe-security`, `rc-codeprobe-architecture`, `rc-codeprobe-performance`, `rc-codeprobe-error-handling`.
- **Git:** `rc-git-guardrails`, `rc-git-commit-push`.
- **Security:** `scar-tissue`, `security-baseline`, `ai-repo-safety`.

`rc-codeprobe/` là bộ companion dùng chung, không tính vào 13 skill. Nó chứa `shared-preamble.md` và các reference:

- `references/api-design.md`
- `references/javascript-typescript.md`
- `references/php-laravel.md`
- `references/python.md`
- `references/react-nextjs.md`
- `references/sql-database.md`

## Lưu ý bảo mật

Chỉ copy các file `.md` từ repository `rightcodehere/skills`. Không copy `scripts/*.py`; Snyk đánh dấu các script này là High Risk.
