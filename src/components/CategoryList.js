import React from 'react'
import { Link } from 'react-router-dom'

const CategoryList = ({title, categories}) => {
  return (
    <div className='categories'>
      <h2>{title}</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id} style={{marginBottom: '10px'}}>
            <Link to={`/categories/${category.id}`}>{category.attributes.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryList