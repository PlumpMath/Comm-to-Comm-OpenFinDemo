(function() {
    'use strict';

    //set the adapter ready UI indicator
    var updateAdapterIndicator = function() {
        var statusIndicator = document.querySelector('#status-indicator');
        statusIndicator.classList.toggle("online");
    };

    //set the OpenFin version number on the page
    var setVersionNumber = function() {
        var versionNumberContainer = document.querySelector('#version-number-container'),
            ofVersion = document.querySelector('#of-version');

        fin.desktop.System.getVersion(function(version) {
            ofVersion.innerText = version;
            versionNumberContainer.classList.toggle('invisible');
        });
    };

    //add the event listener for the learn more button.
    var setLearnMoreEventHandler = function() {
        var learnMoreButton = document.querySelector('#learn-more');

        learnMoreButton.addEventListener('click', function() {
            fin.desktop.System.openUrlWithBrowser('https://openfin.co/developers/javascript-api/');
        });
    };

    var setVisibilityDisplayOnce = function() {
        document.querySelector('#inter-app-messages').style.display = 'block';
        setVisibilityDisplayOnce = function() {};
    };

    var subscribeToInterAppBus = function() {
        var messageCtrl = document.querySelector('#message'),
            timeStampCtrl = document.querySelector('#time');

        fin.desktop.InterApplicationBus.subscribe('*', 'inter:app:sub', function(msg) {
            setVisibilityDisplayOnce();
            messageCtrl.innerText = msg.message;
            timeStampCtrl.innerText = new Date(msg.timeStamp).toLocaleTimeString();
        });
    };

    //event listeners.
    document.addEventListener('DOMContentLoaded', function() {
        //OpenFin is ready
        fin.desktop.main(function() {
            //#1
            fin.desktop.InterApplicationBus.subscribe(
                "h6kn49cl5ll92j4i",
                "child",
                "topic",
                function(m, u) {
                    console.log([m, u]);
                    //#4
                    fin.desktop.InterApplicationBus.send("h6kn49cl5ll92j4i", "child", "topic", "World");
                },
                function() {
                    console.log("parent subscribe success");
                },
                function() {
                    console.log("parent subscribe err");
                });


            var child = new fin.desktop.Window({
                name: "child",
                defaultWidth: 266,
                defaultHeight: 127
            }, function() {
                // gets the HTML window of the child
                var wnd = child.getNativeWindow();
                //wnd.console.log("c0");
                //wnd.alert("c1");
                wnd.fin.desktop.main(function() {
                    //#2
                    //wnd.alert("c2");
                    wnd.fin.desktop.InterApplicationBus.subscribe(
                        "h6kn49cl5ll92j4i",
                        "topic",
                        function(m, u) {
                            wnd.console.log([m, u]);
                        },
                        function() {
                            //wnd.alert("c3");
                            wnd.console.log("child subscribe success");
                        },
                        function() {
                            wnd.console.log("child subscribe err");
                        });

                    //#3
                    wnd.fin.desktop.InterApplicationBus.send("h6kn49cl5ll92j4i", "topic", "Hello");

                });
                //});
                child.show();
            });
        });
    });
}());
