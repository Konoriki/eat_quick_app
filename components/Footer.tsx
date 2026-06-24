export default function Footer() {
  const opening = [
    { day: "Sunday", time: "closed" },
    { day: "Monday", time: "closed" },
    { day: "Tuesday", time: "10am to 3pm" },
    { day: "Wednesday", time: "10am to 3pm - 7pm to 10pm" },
    { day: "Thursday", time: "10am to 3pm" },
    { day: "Friday", time: "10am to 3pm" },
    { day: "Saturday", time: "10am to 3pm - 7pm to 10pm" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-12 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-8 text-white tracking-wide">Opening Hours</h3>
        <ul className="space-y-3">
          {opening.map((schedule, index) => (
            <li key={index} className="flex justify-center gap-6">
              <span className={`font-semibold w-32 text-right ${schedule.time === 'closed' ? 'text-slate-500' : 'text-slate-200'}`}>
                {schedule.day}
              </span>
              <span className={`w-56 text-left ${schedule.time === 'closed' ? 'text-red-400/80 italic' : 'text-orange-400 font-medium'}`}>
                {schedule.time}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500">
          © {new Date().getFullYear()} Eat Quick. All rights reserved.
        </div>
      </div>
    </footer>
  );
}