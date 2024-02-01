import React, { useContext, } from 'react'
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, styled } from '@mui/material';
import LogOutButton from '../Log-Register/LogOutButton'
import CustomLink from '../CustomLink/CustomLink'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BasicContext } from '../../context/BasicContext'
import Coins from '../Coins';
import { NavLink } from 'react-router-dom';
import LogInButton from '../Log-Register/LogInButton';

const MobileNavigation = ({handler, open, navLinks, userLinks}) => {
    const ctx = useContext(BasicContext)
    const {isLoggedIn, userData} = ctx

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
      }));

  return (
    <Drawer
        anchor='right'
        open={open}
        onClose={handler}
    >
        {/*TODO: toj pacioj vietoj mygtuka isjungimo  */}
        <DrawerHeader>
            <IconButton onClick={handler}>
                <ChevronRightIcon />
            </IconButton>
        </DrawerHeader>
        <Box
            sx={{ width: 250, 'a': { textDecoration: 'none', color: 'black'} }}
            role="presentation"
            onClick={handler}
            onKeyDown={handler}
            >
            {isLoggedIn && (
                <>
                <List>
                    <ListItem>
                        <ListItemText primary={`Hello, ${userData && userData.user.username}`} />
                    </ListItem>

                    <ListItem>
                        <Coins />
                    </ListItem>
                    {userLinks.map(link => (
                        <CustomLink key={link.id} link={link} />
                    ))}
                </List>
                <Divider />
                </>
            )}
            <List>
                {/* link componenta  */}
                {navLinks.map(item => (
                <ListItem key={item.id}>
                    <NavLink to={item.url} target={item.target} className={item.content}>
                    <span>{item.content}</span>
                    </NavLink>
                </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem>
                    {isLoggedIn ? (
                        <LogOutButton />
                    ) : (
                        <LogInButton />
                    )}
                </ListItem>
            </List>

        </Box>
    </Drawer>

  )
}

export default MobileNavigation