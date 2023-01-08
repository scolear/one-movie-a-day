import data from '../data.json';

function spliceCaption(caption) {
  const ratingIndex = caption.indexOf('\u27a1\ufe0f');
  const newLine = caption.indexOf('\n');
  return {
    "title": caption.slice(0, ratingIndex),
    "rating": caption.slice(ratingIndex + 3, newLine),
    "comments": caption.slice(newLine)
  };
}

const filteredData = data.filter(post => post.user.username == "bogiaranyi");

const formattedData = filteredData.map(post => {
  const parsedCaption = spliceCaption(post.caption_text);
  return {
    "key": post.id,
    "date": post.taken_at,
    "link": `www.instagram.com/p/${post.code}/`,
    "movie_title": parsedCaption.title,
    "rating": parsedCaption.rating,
    "comment": parsedCaption.comments,
    "resources": post.resources.map(resource => resource.thumbnail_url)
  }
})

export default () => {
  return formattedData.slice(0, 10);
}
