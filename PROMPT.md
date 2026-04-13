# 校内統合管理システム — 設計プロンプト

## 概要

高校向けの Web アプリケーション。校内に散在するドキュメント・申請書類を一元管理する「書類管理」機能と、施設の利用状況を可視化・予約できる「施設予約」機能を一つのシステムに統合する。

---

## 技術スタック

| レイヤー | 選定技術 |
|---|---|
| フロントエンド | React + TypeScript + Vite |
| スタイリング | Tailwind CSS |
| 状態管理 | React Context + useReducer |
| ルーティング | React Router v6 |
| PDF 生成 | react-pdf / jsPDF |
| カレンダー | react-big-calendar または自作 |
| データ永続化 | localStorage（MVP）→ 将来的に REST API |
| デプロイ | 静的ホスティング（Vercel / GitHub Pages） |

---

## 画面構成

```
/                → リダイレクト → /documents
/documents       → 書類管理トップ
/documents/:id   → 書類詳細（FORM入力 / 空白印刷）
/facilities      → 施設予約カレンダー
/facilities/new  → 予約追加モーダル（URL遷移なしでもよい）
```

---

## 共通レイアウト

### ヘッダー

- 左上：校名ロゴ（2行：サブタイトル＋メインタイトル）
- 中央：タブナビゲーション
  - `書類管理`（アイコン付き、件数バッジ）
  - `施設予約`（アイコン付き、件数バッジ）
- 右上：現在日時（`YYYY年MM月DD日(曜)`）

### サイドバー

モードによって内容が切り替わる（下記参照）。

---

## 機能 1：書類管理

### サイドバー（カテゴリフィルター）

```
CATEGORIES / カテゴリ
─────────────────────
● すべて        [11]
👤 生徒関係      [2]
🎓 教職員関係    [3]
👨‍👩‍👧 保護者向け  [2]
🎉 行事・部活    [2]
💻 情報・ICT     [2]
```

- 選択中カテゴリはハイライト（左ボーダー＋背景色）
- 件数バッジは右端に表示

### メインエリア

#### ページヘッダー

```
すべての書類
11 件          [🔍 書類を検索...]
```

- 検索ボックスはリアルタイムフィルタリング（タイトル・説明文を対象）

#### 書類カード（グリッド 2 列）

各カードに以下を含む：

| 要素 | 詳細 |
|---|---|
| カテゴリバッジ | カテゴリ名＋アイコン、左上に表示 |
| カード上部ボーダー | カテゴリ別カラーコード（4px） |
| タイトル | 大きめフォント、太字 |
| 説明文 | 1〜2行、グレー文字 |
| 項目数 | `📋 N 項目` |
| アクションボタン | `FORM入力`（ダーク背景）／`空白印刷`（アウトライン） |

#### カテゴリ別カラー

| カテゴリ | カラー |
|---|---|
| 生徒関係 | オレンジ系 |
| 教職員関係 | グリーン系 |
| 保護者向け | パープル系 |
| 行事・部活 | ブルー系 |
| 情報・ICT | ティール系 |

### 書類データ構造

```typescript
interface Document {
  id: string;
  title: string;           // 例: "欠席・遅刻・早退届"
  description: string;     // 例: "生徒の欠席、遅刻、早退を届け出る書類"
  category: Category;
  itemCount: number;       // フォームの項目数
  fields: FormField[];     // FORM入力用フィールド定義
  pdfTemplate?: string;    // 空白印刷用テンプレートパス
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required: boolean;
  options?: string[];      // select / radio 用
  placeholder?: string;
}

type Category =
  | 'student'      // 生徒関係
  | 'staff'        // 教職員関係
  | 'parent'       // 保護者向け
  | 'event'        // 行事・部活
  | 'ict';         // 情報・ICT
```

### FORM 入力機能

1. カードの「FORM入力」ボタンをクリック
2. モーダルまたは詳細ページに遷移
3. フィールド定義に基づいた動的フォームを描画
4. バリデーション後、**PDF として出力**（ブラウザ印刷ダイアログ or ダウンロード）
5. 入力中データは localStorage に一時保存（ブラウザリロード対策）

### 空白印刷機能

1. カードの「空白印刷」ボタンをクリック
2. 書類タイトル・項目ラベルのみ印字されたブランクフォームを PDF 生成
3. ブラウザの印刷ダイアログを開く
4. 手書き記入用のフォームとして出力

---

## 機能 2：施設予約

### サイドバー（施設フィルター）

```
FACILITIES / 施設フィルター
────────────────────────────
● すべての施設
🔴 体育館
🟢 グラウンド
🔵 第1会議室
🟣 第2会議室
🟡 視聴覚室
🟦 コンピュータ室

直近の予約
─────────
04/14 09:00
体育館・バスケットボール部

04/14 15:00
グラウンド・野球部

04/15 13:00
第1会議室・生徒会
```

- 施設ごとにカラーコードを固定割り当て
- 「直近の予約」は今日以降 3〜5 件を表示

### メインエリア：カレンダー

#### ヘッダー

```
[‹]  2026年 4月  [›]   [今月]   [+ 予約追加]
```

#### 月表示カレンダー

- 7列（日〜土）、週単位で行を構成
- 日曜：赤文字、土曜：青文字
- 今日：丸囲み（ゴールドボーダー）
- 各日付セルにイベントを最大 N 件表示
  - `HH:MM イベント名` 形式
  - 施設カラーで左ボーダーまたは背景色を付与
  - 件数超過時は `+N件` で省略

### 予約データ構造

```typescript
interface Reservation {
  id: string;
  facilityId: FacilityId;
  title: string;           // 例: "バスケットボール部"
  date: string;            // ISO 8601: "2026-04-14"
  startTime: string;       // "09:00"
  endTime: string;         // "12:00"
  organizer: string;       // 予約者名・団体名
  notes?: string;
  createdAt: string;
}

type FacilityId =
  | 'gymnasium'     // 体育館
  | 'ground'        // グラウンド
  | 'meeting1'      // 第1会議室
  | 'meeting2'      // 第2会議室
  | 'av_room'       // 視聴覚室
  | 'computer';     // コンピュータ室
```

### 予約追加モーダル

フォーム項目：

| フィールド | 型 | 必須 |
|---|---|---|
| 施設 | select | ✓ |
| タイトル / 用途 | text | ✓ |
| 日付 | date | ✓ |
| 開始時刻 | time | ✓ |
| 終了時刻 | time | ✓ |
| 予約者名・団体 | text | ✓ |
| 備考 | textarea | — |

バリデーション：
- 同一施設・同一時間帯の二重予約を禁止
- 終了時刻 > 開始時刻

---

## デザイントークン

```css
/* カラーパレット */
--color-navy:      #1a2340;  /* サイドバー背景 */
--color-navy-dark: #111827;  /* ヘッダー背景 */
--color-gold:      #c9a227;  /* アクセント・今日マーカー */
--color-surface:   #f4f1eb;  /* メインエリア背景（クリーム） */
--color-card:      #ffffff;  /* カード背景 */
--color-text-primary:   #1a2340;
--color-text-secondary: #6b7280;

/* 施設カラー */
--facility-gymnasium: #ef4444;  /* 赤 */
--facility-ground:    #22c55e;  /* 緑 */
--facility-meeting1:  #3b82f6;  /* 青 */
--facility-meeting2:  #a855f7;  /* 紫 */
--facility-av-room:   #f59e0b;  /* 黄 */
--facility-computer:  #14b8a6;  /* ティール */
```

---

## サンプルデータ（書類 11 件）

| # | タイトル | カテゴリ | 説明 |
|---|---|---|---|
| 1 | 欠席・遅刻・早退届 | 生徒関係 | 生徒の欠席、遅刻、早退を届け出る書類 |
| 2 | 進路希望調査票 | 生徒関係 | 進学・就職等の進路希望を申告する書類 |
| 3 | 出張申請書 | 教職員関係 | 校外研修・出張の申請書類 |
| 4 | 休暇届 | 教職員関係 | 年次有給休暇・特別休暇等の届出 |
| 5 | 時間外勤務申請書 | 教職員関係 | 時間外・休日勤務の事前申請 |
| 6 | 入学説明会参加申込書 | 保護者向け | 保護者向け入学説明会の参加申込 |
| 7 | 保護者連絡票 | 保護者向け | 保護者への各種連絡・回答用紙 |
| 8 | 行事参加申込書 | 行事・部活 | 校内行事・大会への参加申込 |
| 9 | 部活動届 | 行事・部活 | 部活動の入部・退部・変更届 |
| 10 | 機器貸出申請書 | 情報・ICT | PC・タブレット等の機器貸出申請 |
| 11 | ネットワーク利用申請 | 情報・ICT | 校内ネットワーク利用の申請書類 |

---

## 実装優先順位（MVP → 拡張）

### Phase 1 — MVP

- [ ] 共通レイアウト（ヘッダー・サイドバー・タブ切替）
- [ ] 書類一覧表示（カード グリッド）
- [ ] カテゴリフィルター・検索
- [ ] 空白印刷（ブラウザ印刷ダイアログ）
- [ ] 施設予約カレンダー（月表示）
- [ ] 予約追加モーダル（localStorage 保存）

### Phase 2 — 拡張

- [ ] FORM 入力 → PDF 出力
- [ ] 施設フィルター（カレンダー絞り込み）
- [ ] 予約詳細モーダル（クリックで表示・編集・削除）
- [ ] 週表示・日表示の切替
- [ ] 印刷レイアウト最適化（`@media print`）

### Phase 3 — 将来

- [ ] バックエンド API（認証・権限管理）
- [ ] 管理者用ダッシュボード（書類テンプレート追加 UI）
- [ ] メール通知（予約確認・リマインダー）
- [ ] 施設ごとの予約可能時間帯設定

---

## ファイル構成（推奨）

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── documents/
│   │   ├── DocumentCard.tsx
│   │   ├── DocumentGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FormModal.tsx        # FORM入力
│   │   └── BlankPrintModal.tsx  # 空白印刷
│   └── facilities/
│       ├── Calendar.tsx
│       ├── CalendarCell.tsx
│       ├── EventChip.tsx
│       ├── FacilityFilter.tsx
│       ├── RecentReservations.tsx
│       └── ReservationModal.tsx
├── data/
│   ├── documents.ts    # サンプル書類データ
│   └── reservations.ts # サンプル予約データ
├── hooks/
│   ├── useDocuments.ts
│   └── useReservations.ts
├── types/
│   └── index.ts
├── utils/
│   ├── pdf.ts          # PDF生成ユーティリティ
│   └── date.ts         # 日付フォーマット
└── App.tsx
```
