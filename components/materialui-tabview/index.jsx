import _ from 'lodash'

import React, { useContext, useEffect, useState, useReducer, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';


function initAnchor (tab, index) {
  tab.anchor = (
    tab.anchor ||
    tab.label?.toLowerCase().trim().replace(/[^\w]+/,'-') || 
    `tab-${index+1}`
  );
}

export default function TabView ({tabs}) {

  if (_.isEmpty(tabs)) {
    return null;
  }

  tabs.forEach(initAnchor);
  const allAnchors = tabs.map(entry => entry.anchor)

  const location = useLocation();
  const hash = location.hash.slice(1);
  const anchor = allAnchors.includes(hash) ? hash : allAnchors[0];
  const navigate = useNavigate();

  return <Box display='flex' flexDirection='column' height="100%">

    <TabContext value={ anchor }>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', height: "3em"}}>
        <TabList onChange={(event, value) => navigate({hash: value}) }>
          {tabs.map(({label, anchor}) => <Tab key={anchor} value={anchor} label={label} />)}
        </TabList>
      </Box>

      {tabs.map(({anchor, content}) => {
        // if `content` is a component fn, it needs a leading capital (dammit, react ...)
        const Content = content; 

        return <TabPanel key={anchor} value={anchor}>
          {_.isFunction(Content)
            ? <Content />
            : Content}
        </TabPanel>
        })}

    </TabContext>
  </Box>
}