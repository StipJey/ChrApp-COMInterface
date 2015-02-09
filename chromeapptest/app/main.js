/**
 * 
 * @author Work
 */

function main() {
    var self = this, model = this.model, form = this;
    var cost = 370;
    
window.addEventListener("FromPage", function(evt) {
    console.log(evt.detail);
    form.label.text = evt.detail;
}, false);

    function formWindowOpened(evt) {//GEN-FIRST:event_formWindowOpened
        console.log('CHRMSG: Ready');
    }//GEN-LAST:event_formWindowOpened

    function buttonActionPerformed(evt) {//GEN-FIRST:event_buttonActionPerformed
        
        var obj = {};
        obj.DeviceType = "weight";
        obj.Action = "send_cost";
        obj.Data = cost;
        console.log("apimsg:" + JSON.stringify(obj));
    }//GEN-LAST:event_buttonActionPerformed
}
