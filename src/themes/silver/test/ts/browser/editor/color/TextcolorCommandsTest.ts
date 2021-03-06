import { Logger, Pipeline, RawAssertions, Step, Log } from '@ephox/agar';
import { Cell } from '@ephox/katamari';
import { TinyApis, TinyLoader, TinyUi  } from '@ephox/mcagar';
import 'tinymce/themes/silver/Theme';
import { UnitTest } from '@ephox/bedrock';
import { PlatformDetection } from '@ephox/sand';

UnitTest.asynctest('TextcolorCommandsTest', (success, failure) => {
    const browser = PlatformDetection.detect().browser;

    const state = Cell(null);

    const sAssertState = function (expected) {
      return Logger.t(`Assert state ${expected}`, Step.sync(function () {
        RawAssertions.assertEq('should be same', expected, state.get());
      }));
    };

    const sResetState = Logger.t('Reset state', Step.sync(function () {
      state.set(null);
    }));

    TinyLoader.setup(function (editor, onSuccess, onFailure) {

      editor.on('ExecCommand', function (e) {
        state.set(e.command);
      });

      const tinyUi = TinyUi(editor);
      const tinyApis = TinyApis(editor);

      Pipeline.async({}, browser.isIE() ? [] : [
        Log.stepsAsStep('TBA', 'TextColor: apply and remove forecolor and make sure of the right command has been executed', [
          tinyApis.sFocus,
          tinyApis.sSetContent('hello test'),
          tinyApis.sSetSelection([0, 0], 0, [0, 0], 5),
          tinyUi.sClickOnToolbar('click forecolor', '[aria-label="Text color"] > .tox-tbtn + .tox-split-button__chevron'),
          tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
          tinyUi.sClickOnUi('click color', 'div[data-mce-color="#18BC9B"]'),
          sAssertState('mceApplyTextcolor'),
          tinyApis.sSetSelection([0, 0, 0], 0, [0, 0, 0], 5),
          tinyUi.sClickOnToolbar('click forecolor', '[aria-label="Text color"] > .tox-tbtn + .tox-split-button__chevron'),
          tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
          tinyUi.sClickOnUi('click remove color', '.tox-swatch--remove'),
          sAssertState('mceRemoveTextcolor'),
          sResetState
        ]),
        Log.stepsAsStep('TBA', 'TextColor: apply and remove backcolor and make sure of the right command has been executed', [
          tinyApis.sFocus,
          tinyApis.sSetContent('hello test'),
          tinyApis.sSetSelection([0, 0], 0, [0, 0], 5),
          tinyUi.sClickOnToolbar('click backcolor', '[aria-label="Background color"] > .tox-tbtn + .tox-split-button__chevron'),
          tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
          tinyUi.sClickOnUi('click green color', 'div[data-mce-color="#18BC9B"]'),
          sAssertState('mceApplyTextcolor'),
          tinyApis.sSetSelection([0, 0, 0], 0, [0, 0, 0], 5),
          tinyUi.sClickOnToolbar('click backcolor', '[aria-label="Background color"] > .tox-tbtn + .tox-split-button__chevron'),
          tinyUi.sWaitForUi('wait for color swatch to open', '.tox-swatches'),
          tinyUi.sClickOnUi('click remove color', '.tox-swatch--remove'),
          sAssertState('mceRemoveTextcolor'),
          sResetState
        ])
      ], onSuccess, onFailure);
    }, {
      toolbar: 'forecolor backcolor',
      base_url: '/project/tinymce/js/tinymce'
    }, success, failure);
  }
);
