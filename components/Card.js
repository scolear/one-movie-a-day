import React, { useState } from 'react'

const Card = ({ images, title, rating, text }) => {
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className="card">
      <div className="card__image-box">
        <img src={images[currentImage]} alt="Card image" />
        {/* <button onClick={() => setCurrentImage((currentImage + 1) % images.length)}>Next</button> */}
      </div>
      <div className="card__text-box">
        <h2 className="card__title">{title}</h2>
        <div className="card__rating">{rating}</div>
        <p className="card__text">{text}</p>
      </div>
    </div>
  )
}

export default Card
