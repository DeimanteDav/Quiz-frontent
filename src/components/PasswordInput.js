import React, { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, FormHelperText  } from '@mui/material'


const PasswordInput = ({label, value, setValue, error = false, errorMsg}) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <FormControl size='small' variant="outlined" error={error && true}>
        <InputLabel htmlFor="password-input">{label}</InputLabel>
        <OutlinedInput
            label={label}
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            endAdornment= {
                <InputAdornment
                position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                    >
                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                </InputAdornment>
            }
        />
        {errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
    </FormControl>
  )
}

export default PasswordInput