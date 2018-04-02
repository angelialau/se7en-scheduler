from formsTest import FormsTest
from navigationTest import NaviTest
from loginTest import LoginTest
import unittest

def suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(FormsTest))    
    suite.addTest(unittest.makeSuite(NaviTest))    
    suite.addTest(unittest.makeSuite(LoginTest))    
    return suite

runner = unittest.TextTestRunner()
runner.run(suite())