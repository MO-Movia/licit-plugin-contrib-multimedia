
# Multimedia ProseMirror Plugin For Licit

Helps to insert images and YouTube video. Automatically calculates the default video size. Allows to resize. Allows to align text around. 

## Build

### Dependency

### Commands

- npm install

- npm pack

#### To use this in Licit

Include plugin in licit component

- import Multimedia

- add VideoPlugin instance in licit's plugin array

```

import { MultimediaPlugin }  from  '@modusoperandi/licit-multimedia';


const  plugins = [new  MultimediaPlugin()]

ReactDOM.render(<Licit docID={0} plugins={plugins}/>


```
