# データベース設計

## 1. マスター系 (Master Data)

### `users` (ユーザー)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| **id** | uuid | PK | 内部識別子 |
| **password_hash** | string | NOT NULL | JWTログイン用のパスワードハッシュ |
| **email** | string | Unique, NOT NULL | ユーザーのメールアドレス |
| **created_at** | datetime | NOT NULL | 作成日時 |
| **updated_at** | datetime | NOT NULL | 更新日時 |

### `tags` (タグマスタ)
| カラム名           | 型        | 制約               | 説明                                  |
| :------------- | :------- | :--------------- | :---------------------------------- |
| **id**         | uuid     | PK               | タグ識別子                               |
| **name**       | string   | Unique, NOT NULL | タグ名 (例: 'コーディング', 'マネジメント')         |
| **category**   | string   | NOT NULL         | 分類 ('work': 業務用, 'analysis': AI分析用) |
| **color_code** | string   | -                | UI表示用のカラーコード (例: '#3b82f6')         |
| **created_at** | datetime | NOT NULL         | 作成日時                                |

### `settings` (システム設定)
| カラム名                | 型        | 制約                          | 説明                        |
| :------------------ | :------- | :-------------------------- | :------------------------ |
| **id**              | uuid     | PK                          | 設定識別子                     |
| **user_id**         | uuid     | FK, NOT NULL                | ユーザーID                    |
| **prompt_template** | text     | NOT NULL                    | AI解析用システムプロンプト            |
| **output_format**   | text     | NOT NULL                    | Markdown出力用テンプレート定義       |
| **storage_path**    | string   | -                           | Google Drive等の保存先パスルール    |
| **webhook_url**     | string   | -                           | Slack/Google Chat等の通知先URL |
| **ai_model**        | string   | default: 'gemini-2.0-flash' | 使用するAIモデルの識別子             |
| **updated_at**      | datetime | NOT NULL                    | 更新日時                      |

---

## 2. インテーク（日報入力）系 (Intake System)

### `daily_reports` (日報ヘッダ)
| カラム名                | 型        | 制約               | 説明                                       |
| :------------------ | :------- | :--------------- | :--------------------------------------- |
| **id**              | uuid     | PK               | 日報識別子                                    |
| **user_id**         | uuid     | FK, NOT NULL     | ユーザーID                                   |
| **target_date**     | date     | NOT NULL         | 業務対象日                                    |
| **start_time**      | datetime | -                | 勤務開始時刻                                   |
| **end_time**        | datetime | -                | 勤務終了時刻                                   |
| **break_minutes**   | integer  | default: 0       | 休憩時間（分）                                  |
| **working_minutes** | integer  | -                | 実稼働時間（分）※保存時に自動計算                        |
| **content_length**  | integer  | -                | 総文字数 ※ダッシュボード集計用                         |
| **reflections**     | jsonb    | -                | 所感リスト `[{title: string, content: text}]` |
| **memos**           | jsonb    | -                | メモリスト `[text]`                           |
| **status**          | string   | default: 'draft' | 状態 ('draft': 一時保存, 'completed': 完了)      |
| **storage_url**     | string   | -                | Google Drive等に保存されたファイルのURL              |
| **created_at**      | datetime | NOT NULL         | 作成日時                                     |
| **updated_at**      | datetime | NOT NULL         | 更新日時                                     |

### `tasks` (業務内容)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| **id** | uuid | PK | タスク識別子 |
| **daily_report_id** | uuid | FK, NOT NULL | 紐付く日報ID |
| **summary** | string | NOT NULL | 業務内容の要約（1行） |
| **estimated_hours** | decimal | - | 予定工数（時間単位） |
| **actual_hours** | decimal | - | 実績工数（時間単位） |
| **status** | string | NOT NULL | 状態 ('on_track', 'delayed', 'completed') |
| **estimated_completion**| datetime | - | 完了予定日時 |
| **created_at** | datetime | NOT NULL | 作成日時 |

### `task_tags` (タスク-タグ中間テーブル)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| **task_id** | uuid | FK, NOT NULL | タスクID |
| **tag_id** | uuid | FK, NOT NULL | タグID |

---

## 3. 解析・定着（バッチ・出力）系 (Analysis & Retention)

### `batch_analyses` (AI解析結果ヘッダ)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| **id** | uuid | PK | 解析結果識別子 |
| **user_id** | uuid | FK, NOT NULL | ユーザーID |
| **start_date** | date | NOT NULL | 集計開始日 |
| **end_date** | date | NOT NULL | 集計終了日 |
| **overall_summary** | text | - | 解析期間の全体概要 |
| **good_points** | text | - | 良かった点の概要 |
| **bad_points** | text | - | 改善すべき点の概要 |
| **quiz_count** | integer | default: 0 | 生成されたクイズ総数 |
| **completed_quiz_count**| integer | default: 0 | 解答済みクイズ数 |
| **action_count** | integer | default: 0 | 生成されたアクションプラン総数 |
| **completed_action_count**| integer | default: 0 | 完了済みアクションプラン数 |
| **is_read** | boolean | default: false | 全体概要の既読フラグ |
| **notified_at** | datetime | - | 通知実行日時 |
| **created_at** | datetime | NOT NULL | 作成日時 |

### `action_plans` (改善アクション)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| **id** | uuid | PK | アクション識別子 |
| **batch_analysis_id** | uuid | FK, NOT NULL | 紐付く解析ID |
| **content** | string | NOT NULL | 具体的なアクション内容 |
| **status** | string | default: 'pending' | 状態 ('pending': 未着手, 'completed': 完了) |
| **created_at** | datetime | NOT NULL | 作成日時 |
| **updated_at** | datetime | NOT NULL | 更新日時 |

### `action_plan_tags` (アクション-タグ中間テーブル)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| **action_plan_id** | uuid | FK, NOT NULL | アクションID |
| **tag_id** | uuid | FK, NOT NULL | タグID |

### `quizzes` (学習定着クイズ)
| カラム名                  | 型        | 制約                             | 説明                                     |
| :-------------------- | :------- | :----------------------------- | :------------------------------------- |
| **id**                | uuid     | PK                             | クイズ識別子                                 |
| **batch_analysis_id** | uuid     | FK, NOT NULL                   | 紐付く解析ID                                |
| **question**          | text     | NOT NULL                       | AIが生成した問題文                             |
| **answer**            | text     | NOT NULL                       | AIが生成した模範解答                            |
| **explanation**       | text     | NOT NULL                       | 解答に至る論理プロセスや背景情報の解説                    |
| **status**            | string   | NOT NULL, default: 'unstarted' | 進捗状態 ('unstarted', 'completed')        |
| **is_correct**        | boolean  | default: null                  | 正誤判定 (null: 未回答, true: 正解, false: 不正解) |
| **completed_at**      | datetime | -                              | クイズを解き終えた日時                            |
| **created_at**        | datetime | NOT NULL                       | レコード作成日時                               |
| **updated_at**        | datetime | NOT NULL                       | レコード更新日時                               |

### `quiz_tags` (クイズ-タグ中間テーブル)
| カラム名 | 型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| **quiz_id** | uuid | FK, NOT NULL | クイズID |
| **tag_id** | uuid | FK, NOT NULL | タグID |
