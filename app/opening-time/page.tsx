export default function OpeningTimePage() {
  const opening = [
    { day: "Sunday", time: "Closed" },
    { day: "Monday", time: "Closed" },
    { day: "Tuesday", time: "10am to 3pm" },
    { day: "Wednesday", time: "10am to 3pm - 7pm to 10pm" },
    { day: "Thursday", time: "10am to 3pm" },
    { day: "Friday", time: "10am to 3pm" },
    { day: "Saturday", time: "10am to 3pm - 7pm to 10pm" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-5xl font-bold mb-8 text-center text-orange-600">Opening Hours</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="space-y-4">
          {opening.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-4 rounded transition">
              <span className="font-semibold text-gray-800 text-lg md:text-xl">{schedule.day}</span>
              <span className={`text-lg md:text-xl font-medium ${schedule.time === 'Closed' ? 'text-red-600' : 'text-green-600'}`}>
                {schedule.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Contact Info</h2>
        <p className="text-gray-700 mb-2"><strong>Phone:</strong> +33 (0)4 67 XX XX XX</p>
        <p className="text-gray-700"><strong>Email:</strong> hello@eatquick.fr</p>
      </div>
    </div>
  );
}