import dataLoaderService from './data-loader.service'

export default (key) => {
  const post = dataLoaderService().allFilteredData.find(d => d.key == key);
  if (!post) return `error finding images with key ${key}`;

  return post.resourceKeys.map(pk =>
    ({
      pk: pk,
      path: `../data/media/bogiaranyi_${pk}.jpg`
    })
  )
}
