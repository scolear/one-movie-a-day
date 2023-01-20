import data from '../data/data.json';

const MEDIA_TYPES = {
  Photo: 1,
  Video: 2,
  Album: 8
}

function spliceCaption(caption) {
  const regex = /^(.+)\s+\(?(\d{4})?\)?\s*➡️\s*(\d+(\,?\.?\d+)?)\/10\s*(.*)$/s;
  const match = caption.match(regex);
  //TODO: we could do an if-else here instead to check for a modified regex which might capture more stuff (or create an ever better regex)
  if (!match) {
    // console.log(caption);
    return null;
  }
  const [, title, date, rating, , comment] = match;
  return {
    title: title + (date ? `${date}` : ''),
    rating: { text: rating , value: parseFloat(rating) },
    comments: comment
  }
}

// Removing duplicates, filtering for user, removing non-standard-compliant formatted ones
function filterData(_data) {
  const ids = _data.map(o => o.id);
  return _data
    .filter((post, index) => !ids.includes(post.id, index + 1))
    .filter(post => post.user.username == "bogiaranyi")
    .filter(post => post.caption_text.includes('\u27a1\ufe0f'));
}

const filteredData = filterData(data);

const formattedData = filteredData.map(post => {
  const parsedCaption = spliceCaption(post.caption_text);
  if (!parsedCaption) {
    console.log(`https://www.instagram.com/p/${post.code}/`, post.caption_text)
    return;}
  return {
    "key": post.pk,
    "date": post.taken_at,
    "link": `https://www.instagram.com/p/${post.code}/`,
    "movie_title": parsedCaption.title,
    "rating": parsedCaption.rating.text,
    "ratingValue": parsedCaption.rating.value,
    "comment": parsedCaption.comments,
    "resourceKeys": post.resources.map(resource => resource.pk)
  }
}).filter(fd => fd?.key); // TODO: This is weird

export default () => {
  return {
    initialData: formattedData
  };
}
