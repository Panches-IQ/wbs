;
gantt.wbs = {
    _isGroupSort: function() {
        var firstTask = gantt.getTask(gantt.getChildren(gantt.config.root_id)[0]);
        return firstTask.$virtual || false;
    },
    _getWBSCode: function(task) {
        if(!task) return "";
        if(task.$virtual) return "";                    
        if(this._isGroupSort()) return task.$wbs || "n/a";
        if(!task.$wbs)
            this._calcWBS();   
        return task.$wbs;
    },
    _setWBSCode: function(task, value) {
        task.$wbs = value;
    },
    getWBSCode: function(task) {                                        
        return gantt.wbs._getWBSCode(task);
    },
    _calcWBS: function() {
        if(this._isGroupSort()) return false;
        var _isFirst = true;
        gantt.eachTask(function(ch) {            
            if(_isFirst) {
                _isFirst = false;
                this.wbs._setWBSCode(ch, "1");
                return;
            } 
            var _prevSibling = gantt.getPrevSibling(ch.id);
            if (_prevSibling != null) {
                var _wbs = gantt.getTask(_prevSibling).$wbs;
                if(_wbs) {
                    _wbs = _wbs.split(".");
                    _wbs[_wbs.length-1]++;
                    this.wbs._setWBSCode(ch, _wbs.join("."));
                } 
            } else {
                var _parent = gantt.getParent(ch.id);
                this.wbs._setWBSCode(ch, gantt.getTask(_parent).$wbs + ".1");
            };            
        }, gantt.config.root_id);
    }
}

gantt.getWBSCode = function getWBSCode(task) {
    return gantt.wbs._getWBSCode(task);
};

gantt.attachEvent("onAfterTaskMove", function() {
    gantt.wbs._calcWBS();
});

gantt.attachEvent("onAfterTaskDelete", function() {
    gantt.wbs._calcWBS();
});
