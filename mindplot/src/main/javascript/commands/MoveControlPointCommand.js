mindplot.commands.MoveControlPointCommand = mindplot.Command.extend(
{
    initialize: function(ctrlPointController, point)
    {
        core.assert(ctrlPointController, 'line can not be null');
        this._ctrlPointControler = ctrlPointController;
        this._line = ctrlPointController._line;
        var model = this._line.getModel();
        this._controlPoint = this._ctrlPointControler.getControlPoint(point).clone();
        this._oldControlPoint= this._ctrlPointControler.getOriginalCtrlPoint(point).clone();
        this._originalEndPoint = this._ctrlPointControler.getOriginalEndPoint(point).clone();
        switch (point){
            case 0:
                this._wasCustom = this._line.getLine().isSrcControlPointCustom();
                this._endPoint = this._line.getLine().getFrom().clone();
                break;
            case 1:
                this._wasCustom = this._line.getLine().isDestControlPointCustom();
                this._endPoint = this._line.getLine().getTo().clone();
                break;
        }
        this._id = mindplot.Command._nextUUID();
        this._point = point;
    },
    execute: function(commandContext)
    {
        var model = this._line.getModel();
        switch (this._point){
            case 0:
                model.setSrcCtrlPoint(this._controlPoint.clone());
                this._line.getLine().setFrom(this._endPoint.x, this._endPoint.y);
                this._line.getLine().setIsSrcControlPointCustom(true);
                this._line.getLine().setSrcControlPoint(this._controlPoint.clone());
                break;
            case 1:
                model.setDestCtrlPoint(this._controlPoint.clone());
                this._wasCustom = this._line.getLine().isDestControlPointCustom();
                this._line.getLine().setTo(this._endPoint.x, this._endPoint.y);
                this._line.getLine().setIsDestControlPointCustom(true);
                this._line.getLine().setDestControlPoint(this._controlPoint.clone());
                break;
        }
        if(this._line.isOnFocus()){
            this._line._refreshSelectedShape();
            this._ctrlPointControler.setLine(this._line);
        }
        this._line.getLine().updateLine(this._point);
    },
    undoExecute: function(commandContext)
    {
        var line = this._line;
        var model = line.getModel();
        switch (this._point){
            case 0:
                if(core.Utils.isDefined(this._oldControlPoint)){
                    line.getLine().setFrom(this._originalEndPoint.x, this._originalEndPoint.y);
                    model.setSrcCtrlPoint(this._oldControlPoint.clone());
                    line.getLine().setSrcControlPoint(this._oldControlPoint.clone());
                    line.getLine().setIsSrcControlPointCustom(this._wasCustom);
                }
            break;
            case 1:
                if(core.Utils.isDefined(this._oldControlPoint)){
                    line.getLine().setTo(this._originalEndPoint.x, this._originalEndPoint.y);
                    model.setDestCtrlPoint(this._oldControlPoint.clone());
                    line.getLine().setDestControlPoint(this._oldControlPoint.clone());
                    line.getLine().setIsDestControlPointCustom(this._wasCustom);
                }
            break;
        }
        this._line.getLine().updateLine(this._point);
        if(this._line.isOnFocus()){
            this._ctrlPointControler.setLine(line);
            line._refreshSelectedShape();
        }
    }
});