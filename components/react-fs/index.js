import React, { useEffect, useState } from 'react';
import _ from 'lodash';



const POLL_INTERVAL = 500;


// file content, as a string
export function useFileStr (fsNode) {
  const [content, setContent] = useState("");
  useEffect(() => 
    fsNode.sub(
      () => fsNode.text()
        .then(setContent)
        .catch(err => {
          console.error("error in useFileStr", fsNode.path, err);
          setContent(null);
        })), 
      []);
  return content;
}

export function useChildren (fsNode, pollInterval) {
  pollInterval = pollInterval || POLL_INTERVAL;
  const [children, setChildren] = useState([]);

  // turns out, `sub` is a really bad way to accomplish this at scale
  useEffect(() => {
    // console.log("useChildren", {fsNode})

    fsNode.children().then(setChildren);
    const poll = setInterval(() => {
        // console.log("useChildren interval 1", {fsNode, children})

        fsNode.children()
          .then(newChildren => {
            setChildren(oldChildren => {
              // console.log("useChildren interval 2", {fsNode, oldChildren, newChildren, isEqual: _.isEqual(oldChildren.map(c => c.name), newChildren.map(c => c.name))})
              return (_.isEqual(oldChildren.map(c => c.name), newChildren.map(c => c.name)))
                ? oldChildren
                : newChildren;
              })
          })
      }, pollInterval);

    return () => clearInterval(poll);
  }, []);

  return children;
}