import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store.js';

const  HomeScreen: React.FC = ()=>{
  const { userInfo } = useSelector((state : RootState) => state.userAuth);
  return (
    <div>
      <h1>Welcome to CURE HUB homepagee {userInfo? userInfo.name : ''}</h1>
    </div>
  )
}

export default HomeScreen
