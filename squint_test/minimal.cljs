(ns main
  (:require
    ["../mystral-shim.js"]
    ["../q5.js"]
    ["../utils.js"]
            ))

(def Canvas initCanvas)

(await (Canvas))

(background "#101820")
(noStroke)

(fill "#ff6b6b")
(circle 0 0 80)
