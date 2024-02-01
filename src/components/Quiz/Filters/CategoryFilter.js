import React from 'react'

const CategoryFilter = ({categories, selected, handleChange, disabled}) => {
  const checkIfDisabled = category => {
    return disabled.some(obj => obj.id === category.id)
  }

  return (
    <fieldset className='filter'>
      <legend className='title'>Category</legend>
      {categories.map(category => (
        <div key={category.id} className={checkIfDisabled(category) ? 'disabled' : ''}>
          <input
            disabled={checkIfDisabled(category)}
            type='checkbox'
            id={'category-'+category.id}
            name='category'
            value={category.id}
            onChange={handleChange}
            checked={selected.includes(category.id)}
          />
          <label htmlFor={'category-'+category.id}>{category.attributes.name}</label>
        </div>
      ))}
    </fieldset>
  )
}

export default CategoryFilter