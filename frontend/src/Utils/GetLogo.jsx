import React, { useEffect, useState } from 'react'
import Loader from '../components/Loaders/Loader';
import PlaceholderIcon from '../Icons/PlaceholderIcon';

function GetLogo({ name, style }) {
    const dynamicModule = import(`../resource/img/integ/${name}.svg`)
    const [Component, setComponent] = useState(null);
    useEffect(() => {
        dynamicModule.then((module) => {
            console.log('module', module)
            setComponent(() => module.default);
        });
    }, [])
    const loaderStyle = {
        display: 'flex',
        height: '85%',
        justifyContent: 'center',
        alignItems: 'center',
    }
    return (
        Component ? <img src={Component} alt={`${name}-logo`} width='100%' style={style} /> : <PlaceholderIcon size={100} text={name} />
    )
}

export default GetLogo