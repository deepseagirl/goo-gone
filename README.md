### goo-gone

[degoogle](https://github.com/deepseagirl/degoogle) for your browser

---

how to use this in firefox (are all browser extensions written in javascript? no idea how cross compatible this is):

1. git clone
2. in firefox go to `about:debugging#/runtime/this-firefox`
3. under `Temporary Extensions`, click `Load Temporary Add-On...` (it will last as long as your browser session)
4. select the `goo-gone` directory
5. search google and results will be cleaned. you can click through or right click to copy

---

todo:
- figure out how to make permanent browser extensions
- stop discarding parts of dom that we want to keep (like `search only for` link)
