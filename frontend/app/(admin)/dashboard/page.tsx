// app/(admin)/dashboard/page.js

export default function DashboardPage() {

  return (

      <div className="space-y-6 p-6">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-2xl font-bold text-gray-800">

              گزارشات بازدید سایت

            </h1>

            <p className="text-gray-600 mt-1">

              مشاهده و تحلیل آمار بازدیدکنندگان سایت

            </p>

          </div>

        </div>

      </div>

  );

}