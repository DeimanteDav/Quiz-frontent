import { TextField } from "@mui/material"

const PasswordMatch = ({firstPassword, secondPassword, setError}) => {
    if (firstPassword !== secondPassword) {
        return setError(true)
    }

    return (
        <>
            <TextField
                type='password'
                size='small'
                label='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField 
                type='password'
                size='small'
                label='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
        </>
    )
}

export default PasswordMatch