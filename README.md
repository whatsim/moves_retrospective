#moves retro

This is a little script I use for summing up historical Moves app data. Moves is a pedometer app for iOS (maybe android?), and as long as you have an account you can log onto their website and download an archive of data. By the way, this is rad.

In the archive there's a bunch of folder subdivisions by time, feel free to use what you're interested in, I always use 'full'. For purposes of this script uses the 'activities.geojson' file.

Usage then is as simple as:

```
> node index.js activities.geojson "Jan 1 2016" "Jan 1 2017" walking
```

The first argument is the input moves geojson file, the next two are the START DATE and END DATE you're interested in. Omitting this sums the whole file. The dates are converted to Date objects by the moment package, so in order to get a single day you'd want to do something like:

```
> node index.js activities.geojson "Jan 1 2016" "Jan 2 2016" walking
```

The last parameter is the type of Moves activity you want to sum up. It defaults to walking. Look in your activities.geojson for others you could use.

On first run it will need to fetch the elevation data, which depending how many places on earth you've been, can take a while. If it errors during this process run the command again, it will pick up where its left off. After you have the elevation data downloaded (it lives in the data folder) subsequent commands that don't need new regions of elevation data should be much faster. I have with 6 or 7 states of moving around about a gig of elevation data.

Anyway, after that data is downloaded, the script will hopefully return something like:

```
15796.528636381703 m positive vertical -15973.841327355613 m negative vertical
6.941631944444445 days 485.36142 miles 974198 steps 45931 calories
```

Hopefully that is relatively self explanatory.

#license

MIT 2014 [http://whatsim.mit-license.org](http://whatsim.mit-license.org)

As with most all of my projects, this is not something I'm supporting but feel free to ask, worst I'll say is know. Feel free to use it for whatever!