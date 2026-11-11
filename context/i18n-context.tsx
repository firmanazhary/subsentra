"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  Currency,
  Language,
  CURRENCY_CONFIGS,
} from "@/types/i18n";

type Translations = Record<string, string>;

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    // Navigation
    "nav.overview": "Overview",
    "nav.subscriptions": "My Subscriptions",
    "nav.savings": "Savings Simulator",
    "nav.insights": "Insights",
    "nav.investment": "Investment Growth",
    "nav.workspace": "Workspace",
    "nav.settings": "Settings",
    "nav.lightMode": "Light Mode",
    "nav.darkMode": "Dark Mode",

    // Header
    "header.date": "Wednesday, November 11, 2026",
    "header.tagline": "Your money, under control.",
    "header.country": "Region",
    "header.currency": "Currency",
    "header.language": "Language",

    // Overview
    "overview.monthlySpending": "Monthly Spending",
    "overview.monthlyDesc": "Your recurring monthly costs",
    "overview.annualSpending": "Annual Spending",
    "overview.annualDesc": "Projected yearly expenses",
    "overview.activeSubs": "Active Subscriptions",
    "overview.activeDesc": "Currently tracking",
    "overview.potentialSavings": "Potential Savings",
    "overview.savingsDesc": "Monthly savings if selected are cancelled",
    "overview.spendingByCategory": "Spending by Category",
    "overview.spendingByCategoryDesc": "Monthly subscription distribution",
    "overview.emptyChart": "Add subscriptions to see your spending chart.",
    "overview.activeListTitle": "Active Subscriptions",
    "overview.activeListDesc": "Your recurring payments",
    "overview.manage": "Manage",
    "overview.noSubs": "No subscriptions yet. Add your first subscription.",
    "overview.insight": "Your money insight",
    "overview.annualInsight": "You're spending {amount} every year.",
    "overview.insightEmpty": "Start adding subscriptions to discover your spending.",
    "overview.insightActive": "Review your subscriptions and find opportunities to save.",
    "overview.loading": "Loading dashboard...",

    // Subscriptions
    "subs.badge": "SUBSCRIPTION MANAGER",
    "subs.title": "Manage your subscriptions",
    "subs.subtitle": "Select the services you currently pay for.",
    "subs.monthlySpending": "Your monthly subscription spending",
    "subs.activeSummary": "{count} active subscriptions · {annual} / year",
    "subs.searchPlaceholder": "Search subscriptions...",
    "subs.popular": "Popular subscriptions",
    "subs.referencePrice": "Reference price",
    "subs.selectedTitle": "Your selected subscriptions",
    "subs.selectedSubtitle": "Adjust these prices to match your actual bills.",
    "subs.noResults": "No subscriptions found.",
    "subs.noSelected": "No subscriptions selected yet.",
    "subs.add": "Add",
    "subs.added": "Added",
    "subs.perMonth": "/mo",
    "subs.loading": "Loading your subscriptions...",

    // Categories
    "cat.All": "All",
    "cat.Streaming": "Streaming",
    "cat.Music": "Music",
    "cat.AI Tools": "AI Tools",
    "cat.Cloud Storage": "Cloud Storage",
    "cat.Fitness": "Fitness",
    "cat.Food Delivery": "Food Delivery",
    "cat.Shopping": "Shopping",

    // Savings Simulator
    "savings.back": "Back to Dashboard",
    "savings.badge": "SMART SAVINGS",
    "savings.title": "Savings Simulator",
    "savings.subtitle": "Find subscriptions you can live without and see how much you could save.",
    "savings.potentialMonthly": "Potential Monthly Savings",
    "savings.potentialAnnual": "Potential Annual Savings",
    "savings.spendingAfter": "Spending After Cancellation",
    "savings.reviewTitle": "Review Your Subscriptions",
    "savings.reviewDesc": "Select the subscriptions you are considering cancelling.",
    "savings.empty": "You haven't added any subscriptions yet.",
    "savings.addBtn": "Add Subscriptions",
    "savings.selectedCount": "{count} subscription(s) selected for cancellation",
    "savings.clearSelection": "Clear selection",
    "savings.investBadge": "WHAT IF YOU INVESTED IT?",
    "savings.investTitle": "Turn savings into future wealth",
    "savings.investDesc": "Estimate what your monthly savings could grow into if invested consistently.",
    "savings.assumedReturn": "Assumed annual return",
    "savings.afterYear": "After {years} year",
    "savings.afterYears": "After {years} years",
    "savings.estimatedValue": "Estimated future value",
    "savings.disclaimer": "Illustrative estimate only. Assumes monthly contributions, monthly compounding, and a constant annual return. Actual investment returns are not guaranteed.",
    "savings.toolDisclaimer": "This tool only estimates potential savings. It does not cancel subscriptions or contact service providers.",
    "savings.loading": "Loading savings simulator...",

    // Insights
    "insights.back": "Back to Dashboard",
    "insights.badge": "YOUR MONEY, UNDERSTOOD",
    "insights.title": "Spending Insights",
    "insights.subtitle": "Understand your recurring expenses and discover ways to spend smarter.",
    "insights.spendingByCategory": "Spending by Category",
    "insights.spendingByCategoryDesc": "See where your monthly subscription money goes.",
    "insights.smartRecs": "Smart Recommendations",
    "insights.smartRecsDesc": "Suggestions based on your subscription patterns.",
    "insights.noRecs": "No recommendations yet. Add subscriptions to unlock personalized insights.",
    "insights.potentialMonthly": "Potential monthly savings",
    "insights.openSimulator": "Open Savings Simulator",
    "insights.loading": "Loading insights...",
    "insights.mostExpensive": "Most expensive subscription",
    "insights.mostExpensiveDesc": "{name} is your highest monthly subscription cost.",
    "insights.topCategory": "Top spending category",
    "insights.topCategoryDesc": "{category} represents {percent}% of your monthly subscription spending.",
    "insights.projectedAnnual": "Projected annual spending",
    "insights.projectedAnnualDesc": "If your current monthly spending stays the same.",
    "insights.noActiveSpending": "No active spending to analyze",
    "insights.noActiveSpendingDesc": "Add subscriptions or clear your cancellation selections to see your insights.",
    "insights.emptyCategory": "Add subscriptions to generate your category breakdown.",
    "insights.disclaimer": "Recommendations are generated from your saved subscription data using simple rules. They do not verify actual usage, account activity, or service cancellation terms.",
    "insights.recExpensiveTitle": "Review your most expensive subscription",
    "insights.recExpensiveDesc": "{name} costs {price} per month. Check whether you use it enough to justify the cost.",
    "insights.recConcentratedTitle": "Your spending is concentrated in one category",
    "insights.recConcentratedDesc": "{category} accounts for {percent}% of your active subscription spending. Review whether you need every service in this category.",
    "insights.recOverlapTitle": "Review overlapping {category} services",
    "insights.recOverlapDesc": "You have {count} subscriptions in {category}. Check whether their features overlap.",
    "insights.recSavingsTitle": "You have a savings plan in progress",
    "insights.recSavingsDesc": "Your selected cancellations could save {monthly} every month, or {annual} per year.",

    // Investment
    "invest.back": "Back to Dashboard",
    "invest.badge": "BUILD YOUR FUTURE",
    "invest.title": "Investment Growth",
    "invest.subtitle": "See what your subscription savings could become when invested consistently over time.",
    "invest.monthlyContribution": "Monthly Contribution",
    "invest.totalContributions": "Total Contributions",
    "invest.estimatedValue": "Estimated Future Value",
    "invest.settingsTitle": "Investment Settings",
    "invest.settingsDesc": "Customize your monthly contribution and return assumption.",
    "invest.durationTitle": "Investment Duration",
    "invest.durationDesc": "Choose how long you plan to invest.",
    "invest.estimatedProfit": "Estimated investment profit",
    "invest.profitDesc": "Future value minus total contributions.",
    "invest.chartTitle": "Your Investment Projection",
    "invest.chartDesc": "Contributions compared with estimated investment value.",
    "invest.resetSavings": "Reset to potential subscription savings",
    "invest.year": "Year",
    "invest.years": "Years",
    "invest.reviewSavingsLink": "Review your subscription savings →",
    "invest.loading": "Loading investment simulator...",
    "invest.assumedReturn": "Assumed annual return",
    "invest.noSavingsHelp": "No cancellation savings selected yet. You can still adjust the contribution manually.",
    "invest.emptyChart": "Increase your monthly contribution to see the growth chart.",
    "invest.understandingTitle": "Understanding this projection",
    "invest.understandingDesc": "This calculator assumes a constant annual return converted into a monthly rate, with contributions made at the end of each month. Real investments fluctuate. Actual results can be higher or lower, including losses. Fees, taxes, and inflation are not included.",
    "invest.chartTotalContributions": "Total contributions",
    "invest.chartEstimatedValue": "Estimated investment value",
    "invest.chartYearLabel": "Year {year}",
  },
  ja: {
    // Navigation
    "nav.overview": "概要",
    "nav.subscriptions": "サブスク一覧",
    "nav.savings": "節約シミュレーター",
    "nav.insights": "インサイト",
    "nav.investment": "資産運用シミュレーション",
    "nav.workspace": "ワークスペース",
    "nav.settings": "設定",
    "nav.lightMode": "ライトモード",
    "nav.darkMode": "ダークモード",

    // Header
    "header.date": "2026年11月11日 水曜日",
    "header.tagline": "あなたのお金をスマートに管理。",
    "header.country": "国・地域",
    "header.currency": "通貨",
    "header.language": "言語",

    // Overview
    "overview.monthlySpending": "月間支出",
    "overview.monthlyDesc": "毎月の継続課金コスト",
    "overview.annualSpending": "年間支出",
    "overview.annualDesc": "予想される年間コスト",
    "overview.activeSubs": "有効なサブスク",
    "overview.activeDesc": "追跡中のサービス数",
    "overview.potentialSavings": "節約可能額",
    "overview.savingsDesc": "解約時に削減できる月間コスト",
    "overview.spendingByCategory": "カテゴリー別支出",
    "overview.spendingByCategoryDesc": "月間サブスクの支出内訳",
    "overview.emptyChart": "サブスクを追加するとグラフが表示されます。",
    "overview.activeListTitle": "有効なサブスク",
    "overview.activeListDesc": "現在のお支払い",
    "overview.manage": "管理する",
    "overview.noSubs": "サブスクがまだありません。最初のサブスクを追加してください。",
    "overview.insight": "マネーインサイト",
    "overview.annualInsight": "年間で {amount} を支出しています。",
    "overview.insightEmpty": "サブスクを追加して、支出を把握しましょう。",
    "overview.insightActive": "サブスクを見直して、無駄な出費を削減しましょう。",
    "overview.loading": "ダッシュボードを読み込み中...",

    // Subscriptions
    "subs.badge": "サブスクリプション管理",
    "subs.title": "サブスクの登録・編集",
    "subs.subtitle": "現在支払っているサービスを選択してください。",
    "subs.monthlySpending": "月間サブスク支出合計",
    "subs.activeSummary": "{count} 件の有効なサブスク · 年間 {annual}",
    "subs.searchPlaceholder": "サブスクを検索...",
    "subs.popular": "人気のサブスク",
    "subs.referencePrice": "参考価格",
    "subs.selectedTitle": "登録済みサブスク",
    "subs.selectedSubtitle": "実際の請求額に合わせて価格を変更できます。",
    "subs.noResults": "該当するサブスクが見つかりません。",
    "subs.noSelected": "まだサブスクが選択されていません。",
    "subs.add": "追加",
    "subs.added": "追加済み",
    "subs.perMonth": "/月",
    "subs.loading": "サブスクを読み込み中...",

    // Categories
    "cat.All": "すべて",
    "cat.Streaming": "動画配信",
    "cat.Music": "音楽",
    "cat.AI Tools": "AIツール",
    "cat.Cloud Storage": "クラウド",
    "cat.Fitness": "フィットネス",
    "cat.Food Delivery": "フード",
    "cat.Shopping": "ショッピング",

    // Savings Simulator
    "savings.back": "ダッシュボードへ戻る",
    "savings.badge": "スマート節約",
    "savings.title": "節約シミュレーター",
    "savings.subtitle": "不要なサブスクを見直して、どれだけ節約できるか計算します。",
    "savings.potentialMonthly": "月間節約可能額",
    "savings.potentialAnnual": "年間節約可能額",
    "savings.spendingAfter": "解約後の支出額",
    "savings.reviewTitle": "サブスクの仕分け",
    "savings.reviewDesc": "解約を検討するサブスクを選択してください。",
    "savings.empty": "まだサブスクが登録されていません。",
    "savings.addBtn": "サブスクを追加する",
    "savings.selectedCount": "{count} 件のサブスクを解約候補として選択中",
    "savings.clearSelection": "選択をクリア",
    "savings.investBadge": "節約したお金を投資したら？",
    "savings.investTitle": "節約を将来の資産へ",
    "savings.investDesc": "浮いたお金を毎月積立投資した場合のシミュレーション。",
    "savings.assumedReturn": "想定年利",
    "savings.afterYear": "{years} 年後",
    "savings.afterYears": "{years} 年後",
    "savings.estimatedValue": "予想資産額",
    "savings.disclaimer": "※ シミュレーション上の試算であり、実際の運用成果を保証するものではありません。",
    "savings.toolDisclaimer": "※ 本シミュレーションは解約を代行するものではありません。",
    "savings.loading": "シミュレーターを読み込み中...",

    // Insights
    "insights.back": "ダッシュボードへ戻る",
    "insights.badge": "支出の分析と最適化",
    "insights.title": "支出インサイト",
    "insights.subtitle": "毎月の固定費を分析し、より賢い使い方を見つけましょう。",
    "insights.spendingByCategory": "カテゴリー別支出",
    "insights.spendingByCategoryDesc": "サブスク費用がどのジャンルに使われているか確認。",
    "insights.smartRecs": "スマートレコメンド",
    "insights.smartRecsDesc": "利用傾向に基づいた改善提案。",
    "insights.noRecs": "提案はまだありません。サブスクを登録すると提案が表示されます。",
    "insights.potentialMonthly": "月間節約可能額",
    "insights.openSimulator": "節約シミュレーターを開く",
    "insights.loading": "インサイトを読み込み中...",
    "insights.mostExpensive": "最も高額なサブスク",
    "insights.mostExpensiveDesc": "{name} が最も高い月額コストです。",
    "insights.topCategory": "最も支出の多いカテゴリー",
    "insights.topCategoryDesc": "{category} が月間サブスク支出の {percent}% を占めています。",
    "insights.projectedAnnual": "年間支出見込み",
    "insights.projectedAnnualDesc": "現在の月間支出が続いた場合の年間合計です。",
    "insights.noActiveSpending": "分析対象の支出がありません",
    "insights.noActiveSpendingDesc": "サブスクを追加するか解約選択を解除してください。",
    "insights.emptyCategory": "サブスクを追加するとカテゴリー別支出が表示されます。",
    "insights.disclaimer": "※ レコメンドは登録されたサブスクデータから機械的に算出された提案です。実際の利用状況や解約条件を保証するものではありません。",
    "insights.recExpensiveTitle": "最高額のサブスクを見直す",
    "insights.recExpensiveDesc": "{name} は月額 {price} かかっています。利用頻度に見合っているか確認しましょう。",
    "insights.recConcentratedTitle": "支出が特定のカテゴリーに集中しています",
    "insights.recConcentratedDesc": "{category} が支出全体の {percent}% を占めています。すべてのサービスが必要か見直しましょう。",
    "insights.recOverlapTitle": "重複している {category} サービスを見直す",
    "insights.recOverlapDesc": "{category} に {count} 件の契約があります。機能が重複していないか確認しましょう。",
    "insights.recSavingsTitle": "節約プランが進行中です",
    "insights.recSavingsDesc": "解約予定のサービスにより、月間 {monthly}（年間 {annual}）の節約が期待できます。",

    // Investment
    "invest.back": "ダッシュボードへ戻る",
    "invest.badge": "未来の資産づくり",
    "invest.title": "資産運用シミュレーション",
    "invest.subtitle": "サブスク節約額を毎月コツコツ積み立てたらどうなるか試算します。",
    "invest.monthlyContribution": "毎月の積立額",
    "invest.totalContributions": "積立元金合計",
    "invest.estimatedValue": "予想資産総額",
    "invest.settingsTitle": "運用設定",
    "invest.settingsDesc": "積立額と想定年利を調整できます。",
    "invest.durationTitle": "運用期間",
    "invest.durationDesc": "投資予定期間を選択してください。",
    "invest.estimatedProfit": "運用益（利益）",
    "invest.profitDesc": "資産総額から元金を差し引いた金額。",
    "invest.chartTitle": "資産推移シミュレーション",
    "invest.chartDesc": "元金と運用成果の比較グラフ。",
    "invest.resetSavings": "節約シミュレーターの金額に戻す",
    "invest.year": "年",
    "invest.years": "年",
    "invest.reviewSavingsLink": "サブスク節約シミュレーターを見直す →",
    "invest.loading": "シミュレーターを読み込み中...",
    "invest.assumedReturn": "想定年利",
    "invest.noSavingsHelp": "解約予定の節約額がまだありません。手動で積立額を調整できます。",
    "invest.emptyChart": "毎月の積立額を設定すると推移グラフが表示されます。",
    "invest.understandingTitle": "この試算について",
    "invest.understandingDesc": "※ このシミュレーターは一定の年利を月利に換算し、毎月末に積み立てを行う想定で計算しています。実際の投資環境では価格変動や損失が生じる場合があります。手数料や税金、インフレ率は考慮されていません。",
    "invest.chartTotalContributions": "積立元金合計",
    "invest.chartEstimatedValue": "予想資産評価額",
    "invest.chartYearLabel": "{year}年目",
  },
  id: {
    // Navigation
    "nav.overview": "Ringkasan",
    "nav.subscriptions": "Langganan Saya",
    "nav.savings": "Simulasi Hemat",
    "nav.insights": "Wawasan",
    "nav.investment": "Pertumbuhan Investasi",
    "nav.workspace": "Ruang Kerja",
    "nav.settings": "Pengaturan",
    "nav.lightMode": "Mode Terang",
    "nav.darkMode": "Mode Gelap",

    // Header
    "header.date": "Rabu, 11 November 2026",
    "header.tagline": "Kelola uangmu, kendalikan masa depanmu.",
    "header.country": "Wilayah",
    "header.currency": "Mata Uang",
    "header.language": "Bahasa",

    // Overview
    "overview.monthlySpending": "Pengeluaran Bulanan",
    "overview.monthlyDesc": "Total biaya rutin per bulan",
    "overview.annualSpending": "Pengeluaran Tahunan",
    "overview.annualDesc": "Estimasi biaya dalam setahun",
    "overview.activeSubs": "Langganan Aktif",
    "overview.activeDesc": "Layanan yang sedang dipantau",
    "overview.potentialSavings": "Potensi Penghematan",
    "overview.savingsDesc": "Uang yang bisa dihemat jika dibatalkan",
    "overview.spendingByCategory": "Pengeluaran per Kategori",
    "overview.spendingByCategoryDesc": "Distribusi langganan bulanan",
    "overview.emptyChart": "Tambahkan langganan untuk melihat grafik pengeluaran.",
    "overview.activeListTitle": "Langganan Aktif",
    "overview.activeListDesc": "Pembayaran rutin Anda",
    "overview.manage": "Kelola",
    "overview.noSubs": "Belum ada langganan. Tambahkan langganan pertama Anda.",
    "overview.insight": "Wawasan Keuangan",
    "overview.annualInsight": "Anda menghabiskan {amount} setiap tahun.",
    "overview.insightEmpty": "Mulai tambahkan langganan untuk melacak pengeluaran Anda.",
    "overview.insightActive": "Tinjau langganan Anda dan temukan peluang untuk berhemat.",
    "overview.loading": "Memuat ringkasan...",

    // Subscriptions
    "subs.badge": "MANAJER LANGGANAN",
    "subs.title": "Kelola Langganan Anda",
    "subs.subtitle": "Pilih layanan yang saat ini Anda bayar.",
    "subs.monthlySpending": "Total pengeluaran langganan bulanan",
    "subs.activeSummary": "{count} langganan aktif · {annual} / tahun",
    "subs.searchPlaceholder": "Cari langganan...",
    "subs.popular": "Langganan populer",
    "subs.referencePrice": "Harga acuan",
    "subs.selectedTitle": "Langganan yang dipilih",
    "subs.selectedSubtitle": "Ubah harga ini sesuai dengan tagihan asli Anda.",
    "subs.noResults": "Langganan tidak ditemukan.",
    "subs.noSelected": "Belum ada langganan yang dipilih.",
    "subs.add": "Tambah",
    "subs.added": "Sudah Ada",
    "subs.perMonth": "/bln",
    "subs.loading": "Memuat daftar langganan...",

    // Categories
    "cat.All": "Semua",
    "cat.Streaming": "Streaming",
    "cat.Music": "Musik",
    "cat.AI Tools": "Alat AI",
    "cat.Cloud Storage": "Penyimpanan Cloud",
    "cat.Fitness": "Kebugaran",
    "cat.Food Delivery": "Makanan",
    "cat.Shopping": "Belanja",

    // Savings Simulator
    "savings.back": "Kembali ke Dashboard",
    "savings.badge": "PENGHEMATAN CERDAS",
    "savings.title": "Simulasi Hemat",
    "savings.subtitle": "Cari langganan yang jarang dipakai dan lihat berapa banyak yang bisa Anda hemat.",
    "savings.potentialMonthly": "Potensi Hemat Bulanan",
    "savings.potentialAnnual": "Potensi Hemat Tahunan",
    "savings.spendingAfter": "Pengeluaran Setelah Batal",
    "savings.reviewTitle": "Tinjau Langganan Anda",
    "savings.reviewDesc": "Pilih langganan yang sedang Anda pertimbangkan untuk dihentikan.",
    "savings.empty": "Anda belum menambahkan langganan.",
    "savings.addBtn": "Tambah Langganan",
    "savings.selectedCount": "{count} langganan dipilih untuk dibatalkan",
    "savings.clearSelection": "Bersihkan pilihan",
    "savings.investBadge": "BAGAIMANA JIKA DIINVESTASIKAN?",
    "savings.investTitle": "Ubah hemat jadi aset masa depan",
    "savings.investDesc": "Perkiraan pertumbuhan jika uang hemat bulanan diinvestasikan secara konsisten.",
    "savings.assumedReturn": "Asumsi imbal hasil tahunan",
    "savings.afterYear": "Setelah {years} tahun",
    "savings.afterYears": "Setelah {years} tahun",
    "savings.estimatedValue": "Estimasi nilai masa depan",
    "savings.disclaimer": "Hanya estimasi ilustratif. Hasil investasi sebenarnya tidak dijamin dan bisa berfluktuasi.",
    "savings.toolDisclaimer": "Alat ini hanya simulasi, tidak membatalkan langganan secara langsung ke penyedia.",
    "savings.loading": "Memuat simulasi...",

    // Insights
    "insights.back": "Kembali ke Dashboard",
    "insights.badge": "ANALISIS KEUANGAN ANDA",
    "insights.title": "Wawasan Pengeluaran",
    "insights.subtitle": "Pahami pengeluaran rutin Anda dan temukan cara cerdas untuk berhemat.",
    "insights.spendingByCategory": "Pengeluaran per Kategori",
    "insights.spendingByCategoryDesc": "Lihat ke mana saja uang langganan bulanan Anda mengalir.",
    "insights.smartRecs": "Rekomendasi Cerdas",
    "insights.smartRecsDesc": "Saran otomatis berdasarkan pola pengeluaran langganan Anda.",
    "insights.noRecs": "Belum ada rekomendasi. Tambahkan langganan untuk membuka wawasan personal.",
    "insights.potentialMonthly": "Potensi hemat bulanan",
    "insights.openSimulator": "Buka Simulasi Hemat",
    "insights.loading": "Memuat wawasan...",
    "insights.mostExpensive": "Langganan Termahal",
    "insights.mostExpensiveDesc": "{name} adalah biaya langganan bulanan tertinggi Anda.",
    "insights.topCategory": "Kategori Pengeluaran Terbesar",
    "insights.topCategoryDesc": "{category} mencakup {percent}% dari total pengeluaran langganan bulanan Anda.",
    "insights.projectedAnnual": "Proyeksi Pengeluaran Tahunan",
    "insights.projectedAnnualDesc": "Jika pengeluaran bulanan Anda tetap sama sepanjang tahun.",
    "insights.noActiveSpending": "Tidak ada pengeluaran aktif untuk dianalisis",
    "insights.noActiveSpendingDesc": "Tambahkan langganan atau batalkan pilihan penghentian untuk melihat wawasan.",
    "insights.emptyCategory": "Tambahkan langganan untuk melihat rincian kategori pengeluaran Anda.",
    "insights.disclaimer": "Rekomendasi dihitung dari data langganan yang Anda masukkan. Sistem tidak memverifikasi riwayat penggunaan nyata atau syarat pembatalan penyedia layanan.",
    "insights.recExpensiveTitle": "Tinjau langganan termahal Anda",
    "insights.recExpensiveDesc": "{name} berharga {price} per bulan. Pastikan Anda cukup sering memakainya agar sebanding dengan biayanya.",
    "insights.recConcentratedTitle": "Pengeluaran Anda terkonsentrasi pada satu kategori",
    "insights.recConcentratedDesc": "{category} mencakup {percent}% dari pengeluaran langganan aktif Anda. Tinjau apakah Anda memerlukan setiap layanan di kategori ini.",
    "insights.recOverlapTitle": "Tinjau layanan {category} yang tumpang tindih",
    "insights.recOverlapDesc": "Anda memiliki {count} langganan dalam kategori {category}. Periksa apakah fitur-fiturnya tumpang tindih.",
    "insights.recSavingsTitle": "Rencana hemat Anda sedang berjalan",
    "insights.recSavingsDesc": "Langganan yang dipilih untuk dibatalkan dapat menghemat {monthly} per bulan, atau {annual} per tahun.",

    // Investment
    "invest.back": "Kembali ke Dashboard",
    "invest.badge": "BANGUN MASA DEPANMU",
    "invest.title": "Pertumbuhan Investasi",
    "invest.subtitle": "Lihat bagaimana tabungan langganan Anda berkembang jika diinvestasikan konsisten.",
    "invest.monthlyContribution": "Kontribusi Bulanan",
    "invest.totalContributions": "Total Modal Disetor",
    "invest.estimatedValue": "Estimasi Nilai Masa Depan",
    "invest.settingsTitle": "Pengaturan Investasi",
    "invest.settingsDesc": "Atur kontribusi bulanan dan asumsi imbal hasil tahunan Anda.",
    "invest.durationTitle": "Durasi Investasi",
    "invest.durationDesc": "Pilih berapa lama rencana investasi Anda.",
    "invest.estimatedProfit": "Estimasi Keuntungan Bersih",
    "invest.profitDesc": "Nilai masa depan dikurangi modal disetor.",
    "invest.chartTitle": "Proyeksi Grafik Pertumbuhan",
    "invest.chartDesc": "Perbandingan modal disetor terhadap estimasi nilai investasi.",
    "invest.resetSavings": "Kembalikan ke potensi hemat langganan",
    "invest.year": "Tahun",
    "invest.years": "Tahun",
    "invest.reviewSavingsLink": "Tinjau penghematan langganan Anda →",
    "invest.loading": "Memuat simulasi investasi...",
    "invest.assumedReturn": "Asumsi imbal hasil tahunan",
    "invest.noSavingsHelp": "Belum ada potensi hemat dari pembatalan. Anda tetap bisa menyesuaikan kontribusi secara manual.",
    "invest.emptyChart": "Tingkatkan kontribusi bulanan untuk melihat grafik pertumbuhan.",
    "invest.understandingTitle": "Memahami proyeksi ini",
    "invest.understandingDesc": "Kalkulator ini mengasumsikan imbal hasil tahunan konstan yang dikonversi ke tingkat bulanan, dengan setoran di akhir setiap bulan. Investasi nyata berfluktuasi dan bisa untung maupun rugi. Biaya admin, pajak, dan inflasi belum diperhitungkan.",
    "invest.chartTotalContributions": "Total modal disetor",
    "invest.chartEstimatedValue": "Estimasi nilai investasi",
    "invest.chartYearLabel": "Tahun ke-{year}",
  },
};

export type CountryCode = "US" | "JP" | "ID";

export type CountryOption = {
  code: CountryCode;
  name: string;
  flag: string;
  defaultLang: Language;
  defaultCurrency: Currency;
};

export const COUNTRIES: CountryOption[] = [
  { code: "US", name: "United States", flag: "🇺🇸", defaultLang: "en", defaultCurrency: "USD" },
  { code: "JP", name: "日本 (Japan)", flag: "🇯🇵", defaultLang: "ja", defaultCurrency: "JPY" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", defaultLang: "id", defaultCurrency: "IDR" },
];

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  selectedCountry: CountryCode;
  setCountry: (country: CountryCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatPrice: (amount: number, overrideCurrency?: Currency) => string;
  convertFromUSD: (amountUSD: number, targetCurrency?: Currency) => number;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [selectedCountry, setSelectedCountryState] = useState<CountryCode>("US");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("subsentry_lang") as Language | null;
      const savedCurr = localStorage.getItem("subsentry_curr") as Currency | null;
      const savedCountry = localStorage.getItem("subsentry_country") as CountryCode | null;

      queueMicrotask(() => {
        if (savedLang && (savedLang === "en" || savedLang === "ja" || savedLang === "id")) {
          setLanguageState(savedLang);
        }
        if (savedCurr && (savedCurr === "USD" || savedCurr === "JPY" || savedCurr === "IDR")) {
          setCurrencyState(savedCurr);
        }
        if (savedCountry && (savedCountry === "US" || savedCountry === "JP" || savedCountry === "ID")) {
          setSelectedCountryState(savedCountry);
        }
      });
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("subsentry_lang", lang);
    } catch {}
  }, []);

  const setCurrency = useCallback((curr: Currency) => {
    setCurrencyState(curr);
    try {
      localStorage.setItem("subsentry_curr", curr);
    } catch {}
  }, []);

  const setCountry = useCallback(
    (country: CountryCode) => {
      setSelectedCountryState(country);
      try {
        localStorage.setItem("subsentry_country", country);
      } catch {}

      const preset = COUNTRIES.find((c) => c.code === country);
      if (preset) {
        setLanguage(preset.defaultLang);
        setCurrency(preset.defaultCurrency);
      }
    },
    [setLanguage, setCurrency]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let str = TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [language]
  );

  const formatPrice = useCallback(
    (amount: number, overrideCurrency?: Currency): string => {
      const targetCurr = overrideCurrency || currency;
      const config = CURRENCY_CONFIGS[targetCurr];

      return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: config.code,
        minimumFractionDigits: config.hasDecimals ? 2 : 0,
        maximumFractionDigits: config.hasDecimals ? 2 : 0,
      }).format(amount);
    },
    [currency]
  );

  const convertFromUSD = useCallback(
    (amountUSD: number, targetCurrency?: Currency): number => {
      const targetCurr = targetCurrency || currency;
      const rate = CURRENCY_CONFIGS[targetCurr].rateFromUSD;
      const converted = amountUSD * rate;
      return CURRENCY_CONFIGS[targetCurr].hasDecimals
        ? Number(converted.toFixed(2))
        : Math.round(converted);
    },
    [currency]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        selectedCountry,
        setCountry,
        t,
        formatPrice,
        convertFromUSD,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
