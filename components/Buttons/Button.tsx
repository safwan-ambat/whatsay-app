import React from 'react'
import { TouchableOpacity } from 'react-native'

interface ButtonProps {
    children: React.ReactNode;
    disabled?: boolean;
}

const Button = ({ children, disabled }: ButtonProps) => {
    return (
        <TouchableOpacity className='rounded-[14px] px-3 py-[14px]' style={{backgroundColor: disabled ? "#0000004D" : "#000000"}}
        disabled={disabled}>
            {children}
        </TouchableOpacity>
    )
}

export default Button