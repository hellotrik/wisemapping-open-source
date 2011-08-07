/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

mindplot.commands.DragTopicCommand = new Class({
    Extends:mindplot.Command,
    initialize: function(topicIds, position, order, parentTopic) {
        $assert(topicIds, "topicIds must be defined");

        this._selectedObjectsIds = topicIds;
        if ($defined(parentTopic))
            this._parentId = parentTopic.getId();

        this._position = position;
        this._order = order;
        this._id = mindplot.Command._nextUUID();
    },
    execute: function(commandContext) {

        var topic = commandContext.findTopics([this._selectedObjectsIds])[0];

        // Save old position ...
        var origParentTopic = topic.getOutgoingConnectedTopic();
        var origOrder = null;
        var origPosition = null;
//        if (topic.getType() == mindplot.model.NodeModel.MAIN_TOPIC_TYPE && origParentTopic != null && origParentTopic.getType() == mindplot.model.NodeModel.MAIN_TOPIC_TYPE)
//        {
        // In this case, topics are positioned using order ...
        origOrder = topic.getOrder();
//        } else
//        {
        origPosition = topic.getPosition().clone();
//        }

        // Disconnect topic ..
        if ($defined(origParentTopic)) {
            commandContext.disconnect(topic);
        }


        // Set topic order ...
        if (this._order != null) {
            topic.setOrder(this._order);
        } else if (this._position != null) {
            // Set position ...
            topic.setPosition(this._position);

        } else {
            $assert("Illegal commnad state exception.");
        }
        this._order = origOrder;
        this._position = origPosition;

        // Finally, connect topic ...
        if ($defined(this._parentId)) {
            var parentTopic = commandContext.findTopics([this._parentId])[0];
            commandContext.connect(topic, parentTopic);
        }

        // Backup old parent id ...
        this._parentId = null;
        if ($defined(origParentTopic)) {
            this._parentId = origParentTopic.getId();
        }

    },
    undoExecute: function(commandContext) {
        this.execute(commandContext);
        var selectedRelationships = commandContext.getSelectedRelationshipLines();
        selectedRelationships.forEach(function(relationshipLine) {
            relationshipLine.redraw();
        });

    }
});