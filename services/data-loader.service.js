import data from "../data/data.json";

const MEDIA_TYPES = {
  Photo: 1,
  Video: 2,
  Album: 8,
};

function spliceCaption(caption) {
  let title, date, rating, comment;

  const regexPatterns = [
    {
      regex: /^(.+)\s+\(?(\d{4})?\)?\s*➡️\s*(\d+(\,?\.?\d+)?)\/10\s*(.*)$/s,
      extract: (match) => {
        [, title, date, rating, , comment] = match;
      },
    },
    {
      regex: /(.+?)\s+((?:\d(?:[.,]\d)?|10))\/10\s*([\s\S]*)/,
      extract: (match) => {
        [, title, rating, comment] = match;
      },
    },
  ];

  let match;
  for (const pattern of regexPatterns) {
    match = caption.match(pattern.regex);
    if (match) {
      pattern.extract(match);
      break;
    }
  }

  if (!match) {
    // console.log(caption);
    return null;
  }

  return {
    title: title + (date ? ` ${date}` : ""),
    rating: { text: rating, value: parseFloat(rating) },
    comments: comment,
  };
}

function processPost(post) {
  const parsedCaption = spliceCaption(post.caption_text);
  if (!parsedCaption) {
    // console.log(`https://www.instagram.com/p/${post.code}/`, post.caption_text);
    return;
  }
  return {
    key: post.pk,
    date: post.taken_at,
    link: `https://www.instagram.com/p/${post.code}/`,
    movie_title: parsedCaption.title,
    rating: parsedCaption.rating.text,
    ratingValue: parsedCaption.rating.value,
    comment: parsedCaption.comments,
    resourceKeys:
      post.media_type == MEDIA_TYPES.Photo
        ? [post.pk]
        : post.resources.map((resource) => resource.pk),
  };
}

const formattedData = data.reduce((acc, post) => {
  const processedPost = processPost(post);
  if (processedPost?.key) {
    acc.push(processedPost);
  }
  return acc;
}, []);

export default () => {
  return {
    initialData: formattedData,
    search: (query) => {
      const regex = new RegExp(query, "i");
      return formattedData.filter((post) =>
        regex.test(post.movie_title + post.comment)
      );
    },
  };
};
