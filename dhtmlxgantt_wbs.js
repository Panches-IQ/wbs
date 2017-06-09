;
gantt.wbs = {
    _wbsObj: {},
    _taskNum: 0,
    _firstId: null,
    _isGroupSort: function() {
        var firstTask = gantt.getTask(gantt.getChildren(gantt.config.root_id)[0]);
        if(firstTask.$virtual) return true;
        return false;
    },
    _getWBSCode: function(task) {
        if(!task) return "";
        if(task.$virtual) return "";                    
        if(this._isGroupSort()) return this._wbsObj[task.id] || "n/a";
        if(!this._wbsObj[task.id])
            this._calcWBSObj();   
        return this._wbsObj[task.id];
    },
    _setWBSCode: function(task, value) {
        this._wbsObj[task.id] = value;
        task.$wbs = value;
    },
    getWBSCode: function(task) {                                        
        return gantt.wbs._getWBSCode(task);
    },
    _calcWBSObj: function() {
        this._taskNum = 0;
        gantt.eachTask(function(ch) {
            this.wbs._taskNum++;
            if(this.wbs._taskNum == 1) {
                this.wbs._setWBSCode(ch, "1");
                this._firstId = ch.id;
            } else {
                var prevSibling = gantt.getPrevSibling(ch.id)
                if(prevSibling != null) {
                    var _wbs = this.wbs._wbsObj[prevSibling];
                    if(_wbs) {
                        _wbs = _wbs.split(".");
                        _wbs[_wbs.length-1]++;
                        this.wbs._setWBSCode(ch, _wbs.join("."));
                    } 
                } else {
                    var parent = gantt.getParent(ch.id);
                    this.wbs._setWBSCode(ch, this.wbs._wbsObj[parent] + ".1");
                };
            };
        }, gantt.config.root_id);
    }
}

gantt.getWBSCode = function getWBSCode(task) {
    return gantt.wbs._getWBSCode(task);
};

gantt.attachEvent("onAfterTaskMove", function() {
    if(!gantt.wbs._isGroupSort())
        gantt.wbs._calcWBSObj();
});

gantt.attachEvent("onAfterTaskDelete", function() {
    gantt.wbs._calcWBSObj();
});
