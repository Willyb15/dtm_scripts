window._sdi = window._sdi || {};
window._sdi.bc = {
    videos: {},
    milestones: [],
    playerName: 'Brightcove',
    ready: false,
    checks: 0,
    checkLimit: 100,
    
    sc: {
        s: function (evt) {
            var sv = window.s_gi(_satellite.getVar('rsid'));
            var m = evt.media;
         
            sv.eVar10 = m.customFields.topic;
            sv.eVar11 = m.id;
            sv.eVar12 = m.customFields.videocontentowner;
            sv.eVar13 = _satellite.getVar('window.SC.dataModel.videoPlayer.value');
            sv.eVar14 = Math.floor(evt.duration);
            return sv;
        }
    },
    init: function(){
        _sdi.bc.trace('init');
        var scripts = document.getElementsByTagName('script'),
            foundBC = false;
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i],
                    src = script.src || '';
            if (src.match(/brightcove\.com/)) {
                foundBC = true;
            }
        }
        if(foundBC)
        {
            _sdi.bc.checkVideoObj();
        } else if(_sdi.bc.checks < _sdi.bc.checkLimit){
            _sdi.bc.checks++;
			setTimeout(_sdi.bc.init,200);
        }
    },
    //Check for the video object
    checkVideoObj: function(){
        var hasVideo = false;
        if(_satellite.getVar('window.SC.Video.templateReady')){            
            if(!window._sdi.bc.ready)
            {
                window._sdi.bc.ready = true;
                _sdi.bc.trace('Found Video');
                _sdi.bc.setupBCTracking(window.SC.Video);
            }            
        }
        else
        {
            setTimeout(_sdi.bc.checkVideoObj,10);
        }
    },
    //update the default event listeners
    setupBCTracking: function(bcl){
        _sdi.bc.trace('setupBCTracking');
        //save copies of the original listeners

            if(!bcl.sdiupdated)
            {                
                bcl.sdiupdated = true;
                bcl._templateReady = bcl.templateReady;

                //rewrite the listeners
                bcl.templateReady = function(e){
                    _sdi.bc.trace('templateReady: '+e.target.experience.id);
                    //fire the original listener first
                    bcl._templateReady(e);
                    window._sdi.bc.onTemplateReady(e);

                };
            }
        
    },
    onTemplateReady: function (e) {
        var bc = _sdi.bc,
            sc = bc.sc;
        
        bc.trace('sdi onTemplateReady');
        //Get the current player and video
        var bcPlayer = brightcove.api.getExperience(e.target.experience.id);
        var bcVP = bcPlayer.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER);
      bc.trace('bcVP.id: '+bcVP.id);
        bcVP.getCurrentVideo(function (videoDTO) {});


        //Method used to track start
        /*var onMediaEventBegin = function (evt) {
            if (!bc.videos[evt.media.id]) {
                bc.videos[evt.media.id] = {};
            }

            var mediaStore = bc.videos[evt.media.id],
                name = evt.media.displayName;

            sc.s(evt).Media.open(name, evt.duration, bc.playerName);
            sc.s(evt).Media.play(name, evt.position);

            mediaStore.started = true;
            bc.trace(evt.media.displayName + ' : start');
        };*/
        
        //Method used to track play
        var onMediaEventPlay = function (evt) {                
            if (!bc.videos[evt.media.id]) {
                bc.videos[evt.media.id] = {};
            }

            var mediaStore = bc.videos[evt.media.id],
                name = evt.media.displayName;
            
            if (mediaStore.started === true) {
                bc.trace(evt.media.displayName + ' : play');
                sc.s(evt).Media.play(evt.media.displayName, evt.position);
            } else{
                bc.trace(evt.media.displayName + ' : start');
                mediaStore.started = true;
                sc.s(evt).Media.open(name, evt.duration, bc.playerName);
                sc.s(evt).Media.play(name, evt.position);
            }
            
        };

        //Method used to track stop
        var onMediaEventStop = function (evt) {                
            var name = evt.media.displayName;

            sc.s(evt).Media.stop(evt.media.displayName, evt.position);
            bc.trace(evt.media.displayName + ' : stop');
        };        

        //Method used to track complete
        var onMediaEventComplete = function (evt) {                
            if (!bc.videos[evt.media.id]) {
                bc.videos[evt.media.id] = {};
            }

            var mediaStore = bc.videos[evt.media.id];
            mediaStore.started = false;
            sc.s(evt).Media.stop(evt.media.displayName, evt.position);
            sc.s(evt).Media.close(evt.media.displayName);

            bc.trace(evt.media.displayName + ' : complete');
        };

        //Method used to track progress events
        var onMediaProgressFired = function (evt) {

            if (!bc.videos[evt.media.id]) {
                bc.videos[evt.media.id] = {};
            }
            var mediaStore = bc.videos[evt.media.id];
            var totalT = evt.duration;
            var currT = evt.position;
            var ms = bc.milestones || [];
            if (ms.length > 0) {
                mediaStore = mediaStore || {};
                var pct = currT / totalT * 100;
                for (var i = 0; i < ms.length; i++) {
                    var next = ms[i + 1] || 100;
                    if (pct > ms[i] && pct <= next && !mediaStore[ms[i]]) {
                        bc.trace('onMediaProgressFired');
                        var label = ms[i] + "% Video played - " + evt.media.displayName;
                        //Custom code for milestone events

                        mediaStore[ms[i]] = true;
                    }
                }
            }
        };

        //attach the new listeners to the brightcove events
        //bcVP.addEventListener(brightcove.api.events.MediaEvent.BEGIN, onMediaEventBegin);
        try{
            bcVP.removeEventListener(brightcove.api.events.MediaEvent.COMPLETE, onMediaEventComplete);
            bcVP.removeEventListener(brightcove.api.events.MediaEvent.PLAY, onMediaEventPlay);
            bcVP.removeEventListener(brightcove.api.events.MediaEvent.PROGRESS, onMediaProgressFired);
            bcVP.removeEventListener(brightcove.api.events.MediaEvent.STOP, onMediaEventStop);
        }catch(e){}
        
        bcVP.addEventListener(brightcove.api.events.MediaEvent.COMPLETE, onMediaEventComplete);
        bcVP.addEventListener(brightcove.api.events.MediaEvent.PLAY, onMediaEventPlay);
        bcVP.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, onMediaProgressFired);
        bcVP.addEventListener(brightcove.api.events.MediaEvent.STOP, onMediaEventStop);

    },
    onTemplateLoad: function (e) {
        //fires on load of the player
    },
    trace: function (str) {
        
        _satellite.notify('SDI BC: ' + str);
    }
};

window._sdi.bc.init();