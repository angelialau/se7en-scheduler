from formsTest import FormsTest
from formsInstructorTest import FormsInstructorTest
from navigationCoordinatorTest import NaviTest as nct 
from navigationInstructorTest import NaviTest as nit 
from loginTest import LoginTest
import unittest

def suite():
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(FormsTest))    
    suite.addTest(unittest.makeSuite(FormsInstructorTest))    
    suite.addTest(unittest.makeSuite(nct))    
    suite.addTest(unittest.makeSuite(nit))    
    suite.addTest(unittest.makeSuite(LoginTest))    
    return suite

runner = unittest.TextTestRunner()
runner.run(suite())