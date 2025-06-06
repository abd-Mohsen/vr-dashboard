import React from 'react';
import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

function OptionsMenu(){
    return(
        <div>
            <Menu menuButton={<img src="/settings.svg" alt="" className="icon"/>}>
                <MenuItem onClick={() => alert('Option 1')}>Option 1</MenuItem>
                <MenuItem onClick={() => alert('Option 2')}>Option 2</MenuItem>
                <MenuItem onClick={() => alert('Option 3')}>Option 3</MenuItem>
            </Menu>
        </div>
        
    );
}

export default OptionsMenu;