import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Hero from './Hero'
import CategoryList from './CategoryList'
import { API_URL } from '../config'

const DynamicZones = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get(`${API_URL}/home-page?populate[image][populate]=*&populate[sections][on][sections.hero][populate]=*&populate[sections][on][sections.category-list][populate]=*`)
            .then(res => setData(res.data.data.attributes))
    }, [])


    if (!data) {
        return ''
    }


    let sections = data.sections.map(section => {
        let sectionType
        switch (section['__component']) {
            case 'sections.hero':
                sectionType = <Hero key={Math.random()} header={section.header} subheader={section.subheader} link={section.link} />
                break
            case 'sections.category-list':
                sectionType = <CategoryList key={Math.random()} title={section.title} categories={section.categories.data} />
                break

            default:
                break
        }
        return sectionType
    })
    

  return (
    <div className='dynamic-zones'>
        {sections}
    </div>
  )
}

export default DynamicZones