
Creates a [material-ui TabContext](https://mui.com/material-ui/react-tabs/#experimental-api), where tabs can be addressed via `#anchors`.

## install

add the following to `package.json`:
```json
{
  "dependencies": {
    "mui-tabview": "@owndir/materialui-tabview"
    // this only works where git is available (ie, it does NOT work on android)
    // "mui-tabview": "https://github.com/wiresnips/owndir-utils.git#workspace=materialui-tabview"
  }
}
```

## usage

```jsx

import TabView from 'mui-tabview'


<TabView tabs={[
    {
      label: "Tab-1",
      content: <TabContentComponent />
    },
    {
      label: "Tab-2",
      anchor: 'second-tab',
      content: <TabContentComponent />
    },
    // ...
  ]}
/>
```

If no anchor is specified, defaults to `the-label`, hyphenated. (if there's no label too, it uses `tab-3`, where the numberis the position of the tab)