# 2‑A  stage & commit
git add db/migrations/20240707_populate_quiz_columns.sql
git commit -m "chore(db): back‑fill quiz columns and recreate content_view"

# 2‑B  push the backend repo (branch is probably 'main')
git push origin $(git branch --show-current)
