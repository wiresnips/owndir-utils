


function sidebar (props) {

  const {fsNode, showOwndir, isNotRoot} = props;

  if (!showOwndir || fsNode.name.startsWith('.owndir')) {
    return null;
  }

  if (!isNotRoot) {
    return <ul>
      <sidebar {...props} />
    </ul>
  }

  const {open, setOpen} = useState(boolean(startOpen));

  return <li>
      <div>
        <div class={`opener ${open  ? 'open' : ''}`}
             onClick={() => setOpen(!open)}>
        </div>
        {fsNode.name}
      </div>
      <ul>
        fsNode.folders.map(fsNode => sidebar({...props, fsNode, isNotRoot: true}))
        fsNode.files.map(fsNode => sidebar({...props, fsNode, isNotRoot: true}))
      </ul>
  </li>
}


function folderView ({fsNode}) {


}


module.exports = {
  sidebar,
  folderView
}