# How to run the app

clone the git repository and run the below script inside the directory

```
docker build . -t ii && docker run -p 8000:8000 -d ii
```

# Checking logs
```
docker logs <container id>     
```

# Objective
<p>
Take time series data from a REST API endpoint and aggregate the provided data from minute values into
10 minute, 30 minute, and 1 hour averaged values based on an aggregate time period specified in the
request.

Create an endpoint that accepts a post request with json body. 

On receiving a request it will use the REST endpoint above to get a set of data. Null checks placed in the aggregate function will return null if the entire column is null, or just return the average of the non-null values.

This data will be averaged together into groups of data with one entry per period minutes

The output format will also be JSON and should match the import format but with less entries to
reflect that entries have been averaged together.

For example the API should provide around 3 hours of data with an entry in each array per minute, so if
{&quot;period&quot;:60} is passed in for the request the output will have 3 entries in each array of the data object
representing 3 time points with a value representing 60 averaged time points each.
</p>

Example: 
```
localhost:8000/api/records/aggr
```

```
{
    "period" : 60
}
```

And sample output that matches the input json structure.
```
{
    "660": {
        "3000": [
            4.440657022847756,
            4.439788179869564,
            4.479153382527332
        ],
        "3001": [
            48.62829639636297,
            48.47156228713512,
            46.94839173375706
        ],
        "3002": [
            1.8621496341112997,
            1.8711959522871395,
            1.860701120555738
        ],
        "3003": [
            45.58307022616937,
            45.244628226142936,
            45.228177390426914
        ],
        "3004": [
            8.870987459463493,
            9.423194432015277,
            9.285310739983053
        ],
        "3005": [
            43.36528074753764,
            43.25014926537305,
            43.24381566340491
        ],
        "time": [
            "2022-11-27T12:13:00.000Z",
            "2022-11-27T13:13:00.000Z",
            "2022-11-27T14:13:00.000Z",
            "2022-11-27T15:13:00.000Z"
        ]
    }
}
```

# Error handler
<ul>
<li><p>period is negative</p></li>
<li><p>period is not a number</p></li>
<li><p>the data source api is not reachable</p></li>
</ul>
