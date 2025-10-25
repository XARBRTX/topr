module.exports = {
  atCall: async function({ message, args }) {
    
    const { stream } = message;
    
    function getQuranPageUrl(pageNumber) {
  // Validate input
  if (isNaN(pageNumber) || pageNumber <= 0) {
    return null;
  }

  // Format page number
  let formattedPageNumber = ('0000' + pageNumber).slice(-4);

  const baseUrl = 'https://ia600701.us.archive.org/BookReader/BookReaderImages.php?zip=/17/items/quran_shubah/quran_shubah_jp2.zip&file=quran_shubah_jp2/quran_shubah_' + formattedPageNumber + '.jp2&id=quran_shubah&scale=2&rotate=0';

  return baseUrl;
}


stream(getQuranPageUrl(args[0] || 3));
  },
  config: {
    name: "Quran",
    aliases: ["قرآن"],
    role: 0,
    countDown: 20,
    shortDescription: "القران الكريم 🤍",
    guide: "{pn} صفحة",
    category: 'إسلاميات 🤍'
  }
}