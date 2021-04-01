/*
 *  TINNED: TINy Node EDitor
 *  Copyright (C) 2021  Jean-Christophe Taveau.
 *
 *  This file is part of TINNED
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with MOL.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';

import * as MOL3D from './components.js';


export class NodeFactory {

  static get(keyword) {
    switch(keyword) {
      case "MOL_ADV_MM": break;
      case "MOL_AGGREGATE": break;
      case "MOL_BASIC_MM": break;
      case "MOL_COLOR_CHOOSER": break;
      case "MOL_DEBUG": break;
      case "MOL_DUPLICATE": break;
      case "MOL_ENDSELECT": break;
      case "MOL_FILL": break;
      case "MOL_FOLD": break;
      case "MOL_GET_STORAGE": break;
      case "MOL_GETTER": break;
      case "MOL_IFTHENELSE": break;
      case "MOL_IJ_SAMPLES": break;
      case "MOL_IMAGE_CALC": break;
      case "MOL_INFO": break;
      case "MOL_INSPECT": break;
      case "MOL_MATH_MACRO": break;
      case "MOL_MATHS": return new MOL3D.Maths();
      case "MOL_MATHS_FORMULA": break;
      case "MOL_MERGE_COLORS": break;
      case "MOL_MONITOR": return new MOL3D.Monitor();
      case "MOL_MONTAGE": break;
      case "MOL_NEW": break;
      case "MOL_NUMBER": return new MOL3D.NumberComponent();
      case "MOL_OPEN_MOL": return new MOL3D.Loader();
      case "MOL_PHIPSI": break;
      case "MOL_RANGE": break;
      case "MOL_RAMACHANDRAN": break;
      case "MOL_ROI": break;
      case "MOL_ROTATE": break;
      case "MOL_SAVE_TIFF": break;
      case "MOL_SELECT_FUNC": break;
      case "MOL_SET_STORAGE": break;
      case "MOL_SETTER": break;
      case "MOL_SPLIT_COLORS": break;
      case "MOL_STATS": break;
      case "MOL_TAB_DATA": break;
      case "MOL_TEST_IMAGE": break;
      case "MOL_THRESHOLD": break;
      case "MOL_TO_STACK": break;
      case "MOL_TRANSFORM": break;
      case "MOL_TYPE": break;
      case "MOL_VIDEO": break;
      case "MOL_VIEW_2D": break;
      case "MOL_VIEW_3D": break;
      case "MOL_VIEW_PLOT": break;
      case "MOL_VIEW_PLOT": break;
      case "MOL_VIEW_STACK": break;
      case "MOL_ZIP": break;
      default: {
        throw `ERR: Unknown Node ${keyword}`;
      }
    }
  }
  

} // End of class NodeFactory



