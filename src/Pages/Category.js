import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../components/Container'
import getCategories from '../services/getCategories'


const Category = () => {
    let {categoryId} = useParams()
    let [category, setCategory] = useState(null)

    useEffect(() => {
        async function getCategory() {
            setCategory(await getCategories(categoryId))
        }
        getCategory()
    }, [categoryId]) 

    if (!category) {
        return ''
    }

  return (
    <Container>
        <div>
            <h1>{category.name}</h1>
            {category.description && <p style={{marginBottom: '30px'}}>{category.description}</p>}

            {category.questions.data.length > 0 ? (
                <ul>
                    {category.questions.data.map(question => (
                        <li style={{marginBottom: '10px'}} key={question.id}>{question.attributes.content}</li>
                    ))}
                </ul>
            ) : (
                <span>This category has no questions</span>
            )}

        </div>

    </Container>
  )
}

export default Category