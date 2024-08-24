import React, { useEffect, useState, useReducer } from 'react';
import { useChildren } from '@owndir/react-fs';
import _ from 'lodash';



// fsNode currently isn't great at running a full scan
// so, instead of relying on fsNode.files and fsNode.folders, 
// I'm going to do it myself with fsNode.children (in one call, vs two)
async function foldersAndFiles (fsNodes) {
  // console.log('foldersAndFiles', fsNodes)

  const folders = [];
  const files = [];
  const extNodes = await Promise.all(fsNodes.map(node => node.info().then(info => [node, info?.isFile])))
  extNodes.forEach(([node, isFile]) => (isFile ? files : folders).push(node))
  return [folders, files];
}


function ignoreFn (ignore) {
  const predicates = ignore.map(spec => 
    _.isString(spec)   ? (fsNode => fsNode.name == spec) :
    _.isRegExp(spec)   ? (fsNode => fsNode.name.match(spec)) :
    _.isFunction(spec) ? spec :
    () => true // default case
  );

  return (fsNode) => {
    return predicates.find(pred => pred(fsNode))
  }
}


function FolderTreeChildren (props) {
  const {fsNode, ignorePredicate, hide_files, selection, selectHook} = props;

  // track our contents
  const children = useChildren(fsNode);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // console.log('processing children for', fsNode.absolutePath, {fsNode, children})
    const visibleChildren = children.filter(c => !ignorePredicate(c));
    foldersAndFiles(visibleChildren)
     .then(([folders, files]) => {
        setFolders(folders);
        setFiles(files);
      })
  }, [children]);


  // console.log("FolderTreeChildren", {children, files, folders})


  return <ul className={'fs-navigator'}>
    {folders.map(folder => 
      <FolderTreeFolder
        {...props} 
        fsNode={folder} 
        key={folder.name} 
      />)}

    {hide_files ? null : 
      files.map(file => {
        const isSelected = _.isEqual(file.path, selection?.path);
        return <li key={file.name}>
          <div className={`file-label ${isSelected ? 'selected' : ''}`} 
               onClick={!selectHook ? null : () => selectHook(file)}
          >
            {file.name}
          </div>
        </li>})}
  </ul>
}


function FolderTreeFolder (props) {
  const {fsNode, openAll, selectHook, selection} = props;
  const isSelected = _.isEqual(fsNode.path, selection?.path);
  const [showChildren, setShowChildren] = useState(!!openAll);

  return <li className={isSelected ? 'selected' : ''}>
    <span className={`toggle ${showChildren ? '' : 'closed'}`}
         onClick={() => setShowChildren(!showChildren)}>
    </span>
    
    <span className={`folder-label`} 
          onClick={!selectHook ? null : () => selectHook(fsNode)}>
      {fsNode.name}
    </span>

    {showChildren
      ? <FolderTreeChildren {...props} />
      : null}
  
  </li>
}


export function FolderTree (props) {
  let {fsNode, openAll, selectHook, ignore, show_owndir, hide_files} = props;
  const [selectedNode, setSelectedNode] = useState(null);

  if (!_.isArray(ignore)) {
    ignore = [ignore]
  }
  if (!show_owndir) {
    ignore.push(/^\.owndir/)
  }

  return <FolderTreeChildren
    {...props}
    ignorePredicate={ignoreFn(ignore)}
    selectHook={fsNode => {
      setSelectedNode(fsNode);

      _.isFunction(selectHook) 
        ? selectHook(fsNode)
        : null;
    }}
    selection={selectedNode}
  />
}
