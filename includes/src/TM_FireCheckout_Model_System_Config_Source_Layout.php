<?php

class TM_FireCheckout_Model_System_Config_Source_Layout
{
    public function toOptionArray()
    {
        return array(
            array('value' => 'col1-set', 'label' => Mage::helper('firecheckout')->__('1 column')),
            array('value' => 'col2-set', 'label' => Mage::helper('firecheckout')->__('2 columns')),
            array('value' => 'col3-set', 'label' => Mage::helper('firecheckout')->__('3 columns'))
        );
    }
}
