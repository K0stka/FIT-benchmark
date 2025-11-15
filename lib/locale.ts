import { format, setDefaultOptions } from "date-fns";

import { cs } from "date-fns/locale";

setDefaultOptions({
	locale: cs,
});

const Date = (date: Date) => format(date, "d. M. yyyy");

const ShortDate = (date: Date) => format(date, "d. M.");

const Time = (date: Date) => format(date, "H:mm");

const DateTime = (date: Date) => format(date, "d. MMMM H:mm");

export const Locale = {
	Date,
	ShortDate,
	Time,
	DateTime,
};
