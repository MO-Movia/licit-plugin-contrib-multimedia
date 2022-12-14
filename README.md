# Video ProseMirror Plugin For Licit

Helps to insert YouTube video. Automatically calculates the default video size. Allows to resize. Allows to align text around. 

## Build

### Dependency

### Commands

- npm install

- npm pack

#### To use this in Licit

Include plugin in licit component

- import VideoPlugin

- add VideoPlugin instance in licit's plugin array

```

import { VideoPlugin }  from  '@modusoperandi/licit-video';


const  plugins = [new  VideoPlugin()]

ReactDOM.render(<Licit docID={0} plugins={plugins}/>


```
