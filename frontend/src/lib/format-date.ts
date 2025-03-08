export const format = (date: string) => {
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));

  const formattedTime = new Intl.DateTimeFormat('es-ES', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true, // Usar formato de 12 horas (AM/PM)
  }).format(new Date(date));

  return `${formattedDate} ${formattedTime}`;
};
