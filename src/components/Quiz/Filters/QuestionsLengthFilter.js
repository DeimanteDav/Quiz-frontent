import { Box, Slider } from '@mui/material'
import React from 'react'

  
const QuestionsLengthFilter = ({range, setRange, setRangeChanged}) => {
    const marks = [
        {
            value: 2,
            label: 'min'
        },
        {
            value: 20,
            label: 'max'
        }
    ]

    const handleChange = (event, newValue) => {
        setRange(newValue);
        setRangeChanged(prevState => !prevState)
    }


    return (
        <div className='filter'>
            <h3>Questions Amount</h3>
            <span>{range[0]}-{range[1]}</span>
            <Box>
                <Slider
                    getAriaLabel={() => 'questions range'}
                    value={range}
                    // TODO: ne onchange, kad nesiustu kiekviena karta keiciant
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    min={2}
                    max={20}
                    marks={marks}
                />
            </Box>
        </div>
  )
}

export default QuestionsLengthFilter