import OriginalFooter from '@theme-original/Footer';
import React from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';

export function HeapAnalytics() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        return null;
    }
    window.heap = window.heap || [], heap.load = function(e, t) {
        window.heap.appid = e, window.heap.config = t = t || {};
        var r = document.createElement("script");
        r.type = "text/javascript", r.async = !0, r.src = "https://cdn.heapanalytics.com/js/heap-" + e + ".js";
        var a = document.getElementsByTagName("script")[0];
        a.parentNode.insertBefore(r, a);
        for (var n = function(e) {
                return function() {
                    heap.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                }
            }, p = ["addEventProperties", 
                    "addUserProperties", 
                    "clearEventProperties", 
                    "identify", 
                    "resetIdentity", 
                    "removeEventProperty", 
                    "setEventProperties", 
                    "track", 
                    "unsetEventProperty"
                ], o = 0; o < p.length; o++) heap[p[o]] = n(p[o])
    };
    heap.load("2760903549");
    return null;
}

export default function Footer(props) {
    const isBrowser = useIsBrowser();
    return (
        <>
        <OriginalFooter {...props} />
        <HeapAnalytics />
        </>
    );
}