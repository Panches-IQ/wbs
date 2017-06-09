;
gantt.wbs = {
    _taskNum: 0,
    _firstId: null,
    _isGroupSort: function() {
        var firstTask = gantt.getTask(gantt.getChildren(gantt.config.root_id)[0]);
        return firstTask.$virtual || false;
    },
    _getWBSCode: function(task) {
        if(!task) return "";
        if(task.$virtual) return "";                    
        if(this._isGroupSort()) return task.$wbs || "n/a";
        if(!task.$wbs)
            this._calcWBSObj();   
        return task.$wbs;
    },
    _setWBSCode: function(task, value) {
        task.$wbs = value;
    },
    getWBSCode: function(task) {                                        
        return gantt.wbs._getWBSCode(task);
    },
    _calcWBSObj: function() {
        if(this._isGroupSort()) return true;
        this._taskNum = 0;
        gantt.eachTask(function(ch) {
            this.wbs._taskNum++;
            if(this.wbs._taskNum == 1) {
                this.wbs._setWBSCode(ch, "1");
                this._firstId = ch.id;
            } else {
                var prevSibling = gantt.getPrevSibling(ch.id)
                if(prevSibling != null) {
                    var _wbs = gantt.getTask(prevSibling).$wbs;
                    if(_wbs) {
                        _wbs = _wbs.split(".");
                        _wbs[_wbs.length-1]++;
                        this.wbs._setWBSCode(ch, _wbs.join("."));
                    } 
                } else {
                    var parent = gantt.getParent(ch.id);
                    this.wbs._setWBSCode(ch, gantt.getTask(parent).$wbs + ".1");
                };
            };
        }, gantt.config.root_id);
    }
}

gantt.getWBSCode = function getWBSCode(task) {
    return gantt.wbs._getWBSCode(task);
};

gantt.attachEvent("onAfterTaskMove", function() {
    gantt.wbs._calcWBSObj();
});

gantt.attachEvent("onAfterTaskDelete", function() {
    gantt.wbs._calcWBSObj();
});
